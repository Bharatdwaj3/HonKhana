import prisma from "../config/prisma-client.ts";

const books = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "Harper Perennial", isbn: "9780061120084", genre: ["FICTION"] },
  { title: "Pride and Prejudice", author: "Jane Austen", publisher: "Penguin Classics", isbn: "9780141439518", genre: ["FICTION"] },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", isbn: "9780743273565", genre: ["FICTION"] },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", publisher: "Harper Perennial", isbn: "9780060883287", genre: ["FICTION"] },

  { title: "Sapiens", author: "Yuval Noah Harari", publisher: "Harper", isbn: "9780062316097", genre: ["NON_FICTION"] },
  { title: "Educated", author: "Tara Westover", publisher: "Random House", isbn: "9780399590504", genre: ["NON_FICTION"] },
  { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", publisher: "Crown", isbn: "9781400052189", genre: ["NON_FICTION"] },
  { title: "Into the Wild", author: "Jon Krakauer", publisher: "Anchor", isbn: "9780385486804", genre: ["NON_FICTION"] },

  { title: "The Hobbit", author: "J.R.R. Tolkien", publisher: "Houghton Mifflin", isbn: "9780547928227", genre: ["FANTASY"] },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", publisher: "Scholastic", isbn: "9780590353427", genre: ["FANTASY"] },
  { title: "A Game of Thrones", author: "George R.R. Martin", publisher: "Bantam", isbn: "9780553573404", genre: ["FANTASY"] },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", publisher: "DAW Books", isbn: "9780756404741", genre: ["FANTASY"] },

  { title: "A Brief History of Time", author: "Stephen Hawking", publisher: "Bantam", isbn: "9780553380163", genre: ["SCIENCE"] },
  { title: "Cosmos", author: "Carl Sagan", publisher: "Ballantine Books", isbn: "9780345539434", genre: ["SCIENCE"] },
  { title: "The Selfish Gene", author: "Richard Dawkins", publisher: "Oxford University Press", isbn: "9780198788607", genre: ["SCIENCE"] },
  { title: "The Origin of Species", author: "Charles Darwin", publisher: "Penguin Classics", isbn: "9780451529060", genre: ["SCIENCE"] },

  { title: "Dune", author: "Frank Herbert", publisher: "Ace Books", isbn: "9780441172719", genre: ["SCIENCE_FICTION"] },
  { title: "1984", author: "George Orwell", publisher: "Signet Classics", isbn: "9780451524935", genre: ["SCIENCE_FICTION"] },
  { title: "Brave New World", author: "Aldous Huxley", publisher: "Harper Perennial", isbn: "9780060850524", genre: ["SCIENCE_FICTION"] },
  { title: "Ender's Game", author: "Orson Scott Card", publisher: "Tor Books", isbn: "9780812550702", genre: ["SCIENCE_FICTION"] },

  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", publisher: "Vintage Crime", isbn: "9780307949486", genre: ["MYSTERY"] },
  { title: "Gone Girl", author: "Gillian Flynn", publisher: "Broadway Books", isbn: "9780307588371", genre: ["MYSTERY"] },
  { title: "And Then There Were None", author: "Agatha Christie", publisher: "William Morrow", isbn: "9780062073488", genre: ["MYSTERY"] },
  { title: "The Big Sleep", author: "Raymond Chandler", publisher: "Vintage Crime", isbn: "9780394758282", genre: ["MYSTERY"] },

  { title: "Me Before You", author: "Jojo Moyes", publisher: "Penguin Books", isbn: "9780143124542", genre: ["ROMANCE"] },
  { title: "The Notebook", author: "Nicholas Sparks", publisher: "Grand Central Publishing", isbn: "9780446605236", genre: ["ROMANCE"] },
  { title: "Outlander", author: "Diana Gabaldon", publisher: "Dell", isbn: "9780440212560", genre: ["ROMANCE"] },
  { title: "The Fault in Our Stars", author: "John Green", publisher: "Dutton Books", isbn: "9780525478812", genre: ["ROMANCE"] },

  { title: "Dracula", author: "Bram Stoker", publisher: "Penguin Classics", isbn: "9780141439846", genre: ["HORROR"] },
  { title: "The Shining", author: "Stephen King", publisher: "Anchor", isbn: "9780307743657", genre: ["HORROR"] },
  { title: "Frankenstein", author: "Mary Shelley", publisher: "Penguin Classics", isbn: "9780141439471", genre: ["HORROR"] },
  { title: "It", author: "Stephen King", publisher: "Scribner", isbn: "9781501142970", genre: ["HORROR"] },

  { title: "Guns, Germs, and Steel", author: "Jared Diamond", publisher: "W. W. Norton", isbn: "9780393317558", genre: ["HISTORY"] },
  { title: "A People's History of the United States", author: "Howard Zinn", publisher: "Harper Perennial", isbn: "9780062397348", genre: ["HISTORY"] },
  { title: "The Diary of a Young Girl", author: "Anne Frank", publisher: "Bantam", isbn: "9780553296983", genre: ["HISTORY"] },
  { title: "1776", author: "David McCullough", publisher: "Simon & Schuster", isbn: "9780743226721", genre: ["HISTORY"] },

  { title: "Steve Jobs", author: "Walter Isaacson", publisher: "Simon & Schuster", isbn: "9781451648539", genre: ["BIOGRAPHY"] },
  { title: "Long Walk to Freedom", author: "Nelson Mandela", publisher: "Back Bay Books", isbn: "9780316548182", genre: ["BIOGRAPHY"] },
  { title: "The Autobiography of Malcolm X", author: "Malcolm X", publisher: "Ballantine Books", isbn: "9780345350688", genre: ["BIOGRAPHY"] },
  { title: "Benjamin Franklin: An American Life", author: "Walter Isaacson", publisher: "Simon & Schuster", isbn: "9780743258074", genre: ["BIOGRAPHY"] },

  { title: "Leaves of Grass", author: "Walt Whitman", publisher: "Penguin Classics", isbn: "9780140421996", genre: ["POETRY"] },
  { title: "The Complete Poems of Emily Dickinson", author: "Emily Dickinson", publisher: "Back Bay Books", isbn: "9780316184137", genre: ["POETRY"] },
  { title: "Milk and Honey", author: "Rupi Kaur", publisher: "Andrews McMeel", isbn: "9781449474256", genre: ["POETRY"] },
  { title: "The Waste Land and Other Poems", author: "T.S. Eliot", publisher: "Mariner Books", isbn: "9780156948777", genre: ["POETRY"] },

  { title: "Hamlet", author: "William Shakespeare", publisher: "Simon & Schuster", isbn: "9780743477123", genre: ["DRAMA"] },
  { title: "A Streetcar Named Desire", author: "Tennessee Williams", publisher: "New Directions", isbn: "9780811216029", genre: ["DRAMA"] },
  { title: "Death of a Salesman", author: "Arthur Miller", publisher: "Penguin Classics", isbn: "9780140481341", genre: ["DRAMA"] },
  { title: "The Crucible", author: "Arthur Miller", publisher: "Penguin Books", isbn: "9780142437339", genre: ["DRAMA"] },

  { title: "Atomic Habits", author: "James Clear", publisher: "Avery", isbn: "9780735211292", genre: ["SELF_HELP"] },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", publisher: "Free Press", isbn: "9780743269513", genre: ["SELF_HELP"] },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie", publisher: "Pocket Books", isbn: "9780671027032", genre: ["SELF_HELP"] },
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl", publisher: "Beacon Press", isbn: "9780807014295", genre: ["SELF_HELP"] },

  { title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", isbn: "9780132350884", genre: ["TECHNOLOGY"] },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", publisher: "Addison-Wesley", isbn: "9780135957059", genre: ["TECHNOLOGY"] },
  { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", publisher: "MIT Press", isbn: "9780262046305", genre: ["TECHNOLOGY"] },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", publisher: "Addison-Wesley", isbn: "9780201835953", genre: ["TECHNOLOGY"] },

  { title: "Meditations", author: "Marcus Aurelius", publisher: "Penguin Classics", isbn: "9780140449334", genre: ["PHILOSOPHY"] },
  { title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", publisher: "Penguin Classics", isbn: "9780140441185", genre: ["PHILOSOPHY"] },
  { title: "The Republic", author: "Plato", publisher: "Penguin Classics", isbn: "9780140455113", genre: ["PHILOSOPHY"] },
  { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", publisher: "Penguin Classics", isbn: "9780140449235", genre: ["PHILOSOPHY"] },

  { title: "Charlotte's Web", author: "E.B. White", publisher: "Harper Collins", isbn: "9780064400558", genre: ["CHILDREN"] },
  { title: "Where the Wild Things Are", author: "Maurice Sendak", publisher: "Harper Collins", isbn: "9780064431781", genre: ["CHILDREN"] },
  { title: "Matilda", author: "Roald Dahl", publisher: "Puffin Books", isbn: "9780142410370", genre: ["CHILDREN"] },
  { title: "The Very Hungry Caterpillar", author: "Eric Carle", publisher: "Philomel Books", isbn: "9780399226908", genre: ["CHILDREN"] },
];

async function main() {
  for (const b of books) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        publisher: b.publisher,
        isbn: b.isbn,
        genre: b.genre,
        totalCopies: 5,
        availableCopies: 5,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`,
      },
    });
    console.log(`Seeded: ${b.title}`);
  }
  console.log(`Done. Seeded ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });