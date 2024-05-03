export async function up(knex) {
  await knex.schema.createTable('cards', (table) => {
    table.increments('id')
    table.string('word')
    table.string('answer')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('cards')
}
