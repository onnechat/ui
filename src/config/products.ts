export interface ProductBrand {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    primaryForeground: string
    gradient: string[]
    palette: { name: string; color: string; foreground: string }[]
  }
}

export const products: ProductBrand[] = [
  {
    id: 'onne',
    name: 'Onne',
    description: 'Real-time communication platform',
    colors: {
      primary: '#D1385C',
      primaryForeground: '#F5F5F5',
      gradient: ['#7C40D1', '#D25DBB', '#F84F6A', '#FE6C3D', '#FF9637'],
      palette: [],
    },
  },
  {
    id: 'onnebook',
    name: 'Onnebook',
    description: 'Contact management & CRM',
    colors: {
      primary: '#d1375c',
      primaryForeground: '#fff',
      gradient: ['#e796e5', '#d1375c', '#fca000', '#4181ff'],
      palette: [
        { name: 'Pink', color: '#e796e5', foreground: '#fff' },
        { name: 'Red', color: '#d1375c', foreground: '#fff' },
        { name: 'Gold', color: '#fca000', foreground: '#fff' },
        { name: 'Blue', color: '#4181ff', foreground: '#fff' },
      ],
    },
  },
]
