export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('cards').del()
  await knex('cards').insert([
    { id: 1, word: 'word1', answer: 'answer1' },
    { id: 2, word: 'word2', answer: 'answer2' },
    { id: 3, word: 'word3', answer: 'answer3' },
  ])
}
