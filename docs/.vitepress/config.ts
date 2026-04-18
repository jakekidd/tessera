import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Graticule',
  description: 'Browser-canvas ASCII component framework',
  base: '/graticule/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/graticule' },
      { text: 'Examples', link: '/examples/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'App Lifecycle', link: '/guide/app' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Layout', link: '/guide/layout' },
            { text: 'Grid Utilities', link: '/guide/grid' },
            { text: 'Interactivity', link: '/guide/interactivity' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Custom Components', link: '/guide/custom' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'graticule()', link: '/api/graticule' },
            { text: 'App', link: '/api/app' },
            { text: 'Screen', link: '/api/screen' },
            { text: 'grid', link: '/api/grid' },
            { text: 'palette', link: '/api/palette' },
            { text: 'Text', link: '/api/text' },
            { text: 'Box', link: '/api/box' },
            { text: 'Button', link: '/api/button' },
            { text: 'Row', link: '/api/row' },
            { text: 'Col', link: '/api/col' },
            { text: 'Tabs', link: '/api/tabs' },
            { text: 'Table', link: '/api/table' },
            { text: 'BarChart', link: '/api/barchart' },
            { text: 'LineGraph', link: '/api/linegraph' },
            { text: 'BarGraph', link: '/api/bargraph' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jakekidd/graticule' },
    ],
  },
})
