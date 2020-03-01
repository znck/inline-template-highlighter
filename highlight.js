const { parse } = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')
const T = require('@babel/types')
const HL = require('highlight.js')
const FS = require('fs')
const Path = require('path')

/**
 * @param {string} code
 */
function highlight(code) {
  const AST = parse(code)

  let source = ''

  traverse(AST, {
    /**
     *
     * @param {import("@babel/traverse").NodePath<import('@babel/types').ObjectExpression>} node$
     */
    ObjectExpression(node$) {
      /**
       * @type {import("@babel/types").ObjectProperty|null}
       */
      const property = node$.node.properties.find(
        property =>
          T.isObjectProperty(property) &&
          T.isIdentifier(property.key) &&
          property.key.name === 'template'
      )

      if (!property) return

      if (T.isTemplateLiteral(property.value)) {
        const template = property.value.quasis[0]

        if (T.isTemplateElement(template)) {
          source = template.value.raw
        }
      }
    },
  })

  if (source) code = code.replace(source, 'INLINE_TEMPLATE_STRING')

  const output = HL.highlight('js', code, true)

  return output.value.replace(
    'INLINE_TEMPLATE_STRING',
    HL.highlight('html', source, true).value
  )
}

const md = require('markdown-it')({
  highlight(str) {
    return `<pre class="hljs"><code>${highlight(str)}</code></pre>`
  },
})

const output = md.render(
  FS.readFileSync(Path.resolve(__dirname, 'README.md'), { encoding: 'utf8' })
)

FS.writeFileSync(
  Path.resolve(__dirname, 'dist/index.html'),
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Inline Template Highlight</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/github.min.css" />
  </head>
  <body>
    ${output}
  </body>
</html>
`.trim()
)
