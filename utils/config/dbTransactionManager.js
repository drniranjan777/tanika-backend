const { Sequelize } = require("sequelize");

/**
 * Runs a Sequelize transaction with schema switching using `SET search_path`.
 * It sets the search_path at transaction start, invokes the provided async block,
 * then resets the search_path to `public` before committing.
 * Rolls back on error.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} schema - PostgreSQL schema name to use for this transaction
 * @param {(transaction: import('sequelize').Transaction) => Promise<T>} block - Async function with queries inside transaction
 * @returns {Promise<T>} returns whatever the block returns
 */
async function runTransactionWithSchema(sequelize, schema, block) {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.query(`SET search_path TO ${schema}`, { transaction });

    const result = await block(transaction);

    await sequelize.query(`SET search_path TO public`, { transaction });

    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Runs a Sequelize transaction on public schema (default)
 * @param {Sequelize} sequelize
 * @param {(transaction: import('sequelize').Transaction) => Promise<T>} block
 */
async function runTransaction(sequelize, block) {
  const transaction = await sequelize.transaction();

  try {
    const result = await block(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  runTransactionWithSchema,
  runTransaction,
};
