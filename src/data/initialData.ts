export const allBooks = [
  {
    id: '1',
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    slug: 'el-principito',
    features: ['Filosofía', 'Infantil'],
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Un clásico sobre la amistad y el amor.' }],
        },
      ],
    },
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81xQZt5OG6L.jpg',
    created_at: '2024-03-20T18:45:00Z',
    price: 0,
  },
  {
    id: '2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    slug: 'cien-anos-de-soledad',
    features: ['Realismo mágico', 'Novela'],
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Una obra maestra de la literatura latinoamericana.' }],
        },
      ],
    },
    coverImage: 'https://m.media-amazon.com/images/I/71hsfHzsD6L.jpg',
    created_at: '2024-04-10T14:20:00Z',
    price: 9.99,
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    slug: '1984',
    features: ['Distopía', 'Política'],
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Una advertencia sobre los peligros del totalitarismo.' }],
        },
      ],
    },
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
    created_at: '2024-05-05T12:00:00Z',
    price: 7.50,
  },
  {
    id: '4',
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes',
    slug: 'don-quijote-de-la-mancha',
    features: ['Clásico', 'Aventura'],
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Una historia entrañable sobre los sueños y la locura.' }],
        },
      ],
    },
    coverImage: 'https://m.media-amazon.com/images/I/71VnOqk8HQL.jpg',
    created_at: '2024-06-01T09:00:00Z',
    price: 0,
  },
  {
    id: '5',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    slug: 'fahrenheit-451',
    features: ['Ciencia ficción', 'Censura'],
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Una crítica al autoritarismo y a la sociedad consumista.' }],
        },
      ],
    },
    coverImage: 'https://m.media-amazon.com/images/I/71OFqSRFDgL.jpg',
    created_at: '2024-07-01T15:30:00Z',
    price: 6.25,
  },
];
