import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/Casino-Lobby-Prototype/'
const lucideTypeExports = new Set(['LucideIcon', 'LucideProps', 'IconNode'])

const toKebabIconName = (name: string) =>
  name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])([0-9])/g, '$1-$2')
    .toLowerCase()

const resolveLucideIconFile = (name: string) =>
  name.endsWith('Icon') ? toKebabIconName(name.slice(0, -4)) : toKebabIconName(name)

const lucideDirectImports = (): Plugin => ({
  name: 'lucide-direct-imports',
  enforce: 'pre',
  transform(code, id) {
    if (!/\.[jt]sx?$/.test(id) || !code.includes('lucide-react')) return null

    const rewritten = code.replace(
      /import\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g,
      (match, typeKeyword: string | undefined, imports: string) => {
        if (typeKeyword) return match

        const specifiers = imports
          .split(',')
          .map((specifier) => specifier.trim())
          .filter(Boolean)

        const valueImports = specifiers.filter((specifier) => {
          const importedName = specifier.split(/\s+as\s+/)[0].trim()
          return !lucideTypeExports.has(importedName)
        })

        if (valueImports.length === 0) return match

        const typeImports = specifiers.filter((specifier) => {
          const importedName = specifier.split(/\s+as\s+/)[0].trim()
          return lucideTypeExports.has(importedName)
        })

        const directImports = valueImports.map((specifier) => {
          const [importedName, localName = importedName] = specifier.split(/\s+as\s+/).map((part) => part.trim())
          const iconFile = resolveLucideIconFile(importedName)
          return `import ${localName} from 'lucide-react/dist/esm/icons/${iconFile}.js';`
        })

        if (typeImports.length > 0) {
          directImports.unshift(`import type { ${typeImports.join(', ')} } from 'lucide-react';`)
        }

        return directImports.join('\n')
      },
    )

    return rewritten === code ? null : { code: rewritten, map: null }
  },
})

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [lucideDirectImports(), react()],
  base: command === 'build' ? repoBase : '/',
}))
