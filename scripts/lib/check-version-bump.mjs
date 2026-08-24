/**
 * Portão de CI: toda alteração de texto numa coleção precisa incrementar a
 * `version` daquela coleção em `_collection.json`.
 *
 * Por quê (SPEC-REPOSITORIO-DE-CONTEUDO.md §Duas versões): a `version` é a
 * ÚNICA chave que o app compara — tanto na reconciliação da semente quanto no
 * sync. Corrigir um verso sem incrementá-la faz o texto novo chegar só a
 * instalações limpas: quem já tem a coleção instalada (via semente OU via sync)
 * mantém o texto velho, sem erro nem aviso em lugar nenhum.
 *
 * Esta biblioteca é pura — não toca git nem disco. O CLI injeta os leitores.
 *
 * @typedef {{ ok: boolean, errors: string[], checked: string[] }} BumpReport
 */

/** Extrai o id da coleção de um caminho `content/{colecao}/arquivo.json`. */
function collectionOf(file, contentRoot) {
  const prefix = `${contentRoot}/`;
  if (!file.startsWith(prefix)) return null;
  const rest = file.slice(prefix.length).split('/');
  return rest.length >= 2 ? rest[0] : null; // ignora `content/README.md` & cia.
}

/** Lê `version` de um `_collection.json` já parseado; null se ausente/inválida. */
function versionOf(json) {
  const v = json?.version;
  return Number.isInteger(v) ? v : null;
}

/**
 * @param {object} opts
 * @param {string[]} opts.changedFiles  caminhos relativos à raiz do repo
 * @param {(collection: string) => object | null} opts.readCurrent  `_collection.json` no HEAD
 * @param {(collection: string) => object | null} opts.readBase     `_collection.json` na base
 * @param {string} [opts.contentRoot]
 * @returns {BumpReport}
 */
export function checkVersionBumps({
  changedFiles,
  readCurrent,
  readBase,
  contentRoot = 'content',
}) {
  const touched = new Set();
  for (const file of changedFiles) {
    const collection = collectionOf(file, contentRoot);
    if (collection) touched.add(collection);
  }

  const errors = [];
  const checked = [...touched].sort();

  for (const collection of checked) {
    const current = readCurrent(collection);

    // Coleção inteira removida: nada a incrementar (a remoção se propaga pelo
    // snapshot de estado completo das coleções que restaram).
    if (current === null) continue;

    const currentVersion = versionOf(current);
    if (currentVersion === null) {
      errors.push(`${collection}: \`version\` ausente ou não-inteira em _collection.json`);
      continue;
    }

    const base = readBase(collection);
    if (base === null) continue; // coleção nova — não há versão anterior

    const baseVersion = versionOf(base);
    if (baseVersion === null) continue; // base inválida; o validador cuida disso

    if (currentVersion <= baseVersion) {
      errors.push(
        `${collection}: arquivos alterados mas \`version\` continua ${currentVersion} ` +
          `(base: ${baseVersion}). Incremente para ${baseVersion + 1} em ` +
          `${contentRoot}/${collection}/_collection.json — sem isso a correção ` +
          `NÃO chega a quem já tem a coleção instalada.`,
      );
    }
  }

  return { ok: errors.length === 0, errors, checked };
}
