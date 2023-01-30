interface SeedData {
  entries: SeedEntry[]
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}

export const seedData:SeedData = {
  entries: [{
    description: 'Pendiente: In dolor est labore et nostrud proident Lorem deserunt nulla qui et nulla ipsum officia.',
    status: 'pending',
    createdAt: Date.now(),
  },
  {
    description: 'En progreso. Consequat deserunt elit adipisicing dolor quis laboris eu voluptate officia.',
    status: 'in-progress',
    createdAt: Date.now() - 1000000,
  },
  {
    description: 'Terminadas. Tempor do irure aliquip elit cupidatat mollit voluptate aliqua aliquip.',
    status: 'finished',
    createdAt: Date.now() - 100000,
  }],
}
