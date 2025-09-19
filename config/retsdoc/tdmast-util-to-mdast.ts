import type { Block, DocContent, Namespace, Nodes, NodeType, RootContentMap } from './tdmast'
import type { Proxied } from './tdmast-util-parents'
import type {
  Heading as MdastHeading,
  Root as MdastRoot,
  RootContent as MdastRootContent,
  Text as MdastText,
} from 'mdast'

import { fromMarkdown } from 'mdast-util-from-markdown'
import { u } from 'unist-builder'

import { find } from './tdmast-util-find.ts'
import { parents } from './tdmast-util-parents.ts'
import { Builder } from './tdmast-util-to-mdast-builder.ts'
import { ContentKind } from './tdmast.ts'

/** @see {@link https://github.com/syntax-tree/mdast-util-to-markdown?tab=readme-ov-file#tomarkdowntree-options} */

/** */
interface State<T extends NodeType = NodeType> {
  // TODO: provide a single `handle` function that matches the appropriate handlers by node type
  handle: Handle<T>
  handlers: Handlers
  options: Options
  // TODO: add user data field
}

type InternalHandle<T extends NodeType, R = T extends typeof ContentKind.Api.Model ? MdastRoot : MdastRootContent[]> = (
  node: Proxied<RootContentMap[T]>,
  state: State<T>,
) => R

type PartialState<T extends State = State> = {
  [K in keyof T]?: K extends 'handlers'
    ? { [H in keyof T[K]]?: T[K][H] | null }
    : T[K] extends (...args: any[]) => any
      ? T[K]
      : Partial<T[K]>
}

type Handle<T extends NodeType = any> =
  InternalHandle<T> extends (n: infer N, s: infer S) => infer R
    ? S extends State
      ? (node: N, state?: PartialState<S>) => R
      : never
    : never

type InternalHandlers = {
  [ContentKind.Api.Model]: InternalHandle<typeof ContentKind.Api.Model>
} & {
  [T in Exclude<NodeType, typeof ContentKind.Api.Model>]: InternalHandle<T>
}

type Handlers = {
  [kind in keyof InternalHandlers]: InternalHandlers[kind] extends InternalHandle<infer T> ? Handle<T> : never
}

type Options = Readonly<{
  handlers: Partial<InternalHandlers>
  headingBaseDepth: 0 | MdastHeading['depth']
}>

/** Handler for unsupported nodes */
const empty = (node: Nodes) => [u('paragraph', [u('text', `{!${node.type}}`)])]

const defaultHandlers: InternalHandlers = {
  [ContentKind.Api.Model]: (node, state) => {
    const res = u('root', [] as MdastRootContent[])

    const packageNodes = find(node, { data: node.data.packages })
    if (packageNodes?.length) res.children.push(...packageNodes.flatMap((n) => state.handlers[n.type](n)))

    return res as MdastRoot
  },
  [ContentKind.Api.Package]: (node, state) => {
    const res: MdastRootContent[] = []

    const title = [u('inlineCode', node.data.displayName), u('text', ' package')]
    if (state.options.headingBaseDepth === 6) {
      res.push(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth + 1) as MdastHeading['depth']
      res.push(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) res.push(...state.handlers[commentNode.type](commentNode))

    const entryPointNodes = find(node, { data: node.data.entryPoints })
    if (entryPointNodes?.length) {
      const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 1) as MdastHeading['depth']
      res.push(...entryPointNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })))
    }

    return res
  },
  [ContentKind.Api.EntryPoint]: (node, state) => {
    const res: MdastRootContent[] = []

    const buildMemberTitle = (name: string) => {
      const title = [u('text', name)]
      if (state.options.headingBaseDepth === 6) {
        return u('paragraph', [u('strong', title)])
      } else {
        const depth = (state.options.headingBaseDepth + 1) as MdastHeading['depth']
        return u('heading', { depth } as const, title)
      }
    }

    const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 1) as MdastHeading['depth']

    const classNodes = find(node, { type: [ContentKind.Api.Class] })
    if (classNodes?.length) {
      res.push(
        buildMemberTitle('Classes'),
        ...classNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    const enumNodes = find(node, { type: [ContentKind.Api.Enum] })
    if (enumNodes?.length) {
      res.push(
        buildMemberTitle('Enumerations'),
        ...enumNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    const functionNodes = find(node, { type: [ContentKind.Api.Function] })
    if (functionNodes?.length) {
      res.push(
        buildMemberTitle('Functions'),
        ...functionNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    const interfaceNodes = find(node, { type: [ContentKind.Api.Interface] })
    if (interfaceNodes?.length) {
      res.push(
        buildMemberTitle('Interfaces'),
        ...interfaceNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    const namespaceNodes = find(node, {
      type: [ContentKind.Api.Namespace as Namespace['type']],
    })
    if (namespaceNodes?.length) {
      // TODO: fix type issue for `ContentKind.Api.Namespace` resulting in `never`
      res.push(
        buildMemberTitle('Namespaces'),
        ...namespaceNodes.flatMap(
          (n) =>
            (state.handlers[n.type] as Handle)(n, {
              options: { headingBaseDepth },
            }) as MdastRootContent[],
        ),
      )
    }

    const variableNodes = find(node, { type: [ContentKind.Api.Variable] })
    if (variableNodes?.length) {
      res.push(
        buildMemberTitle('Variables'),
        ...variableNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    const typeAliasNodes = find(node, { type: [ContentKind.Api.TypeAlias] })
    if (typeAliasNodes?.length) {
      res.push(
        buildMemberTitle('Type Aliases'),
        ...typeAliasNodes.flatMap((n) => state.handlers[n.type](n, { options: { headingBaseDepth } })),
      )
    }

    return res
  },
  //* [ContentKind.Doc.Block]: (node, state) => {const builder = new Builder(); return builder.content},
  [ContentKind.Api.Class]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', node.data.displayName), u('text', ' class')]
    if (state.options.headingBaseDepth === 6) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth + 1) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    // TODO: "Extends: ..."

    const buildMemberTitle = (name: string) => {
      const title = [u('text', name)]
      // if (state.options.headingBaseDepth === 6) {
      if (state.options.headingBaseDepth > 4) {
        return u('paragraph', [u('strong', title)])
      } else {
        const depth = (state.options.headingBaseDepth +
          // 1) as MdastHeading['depth']
          2) as MdastHeading['depth']
        return u('heading', { depth } as const, title)
      }
    }

    const constructorNodes = find(node, { type: [ContentKind.Api.Constructor] })
    if (constructorNodes?.length) {
      builder.add(buildMemberTitle('Constructors'))
      builder.add(constructorNodes, undefined, state)
    }

    const propertyNodes = find(node, { type: [ContentKind.Api.Property] })
    if (propertyNodes?.length) {
      builder.add(buildMemberTitle('Properties'))
      builder.add(propertyNodes, undefined, state)
    }

    const methodNodes = find(node, { type: [ContentKind.Api.Method] })
    if (methodNodes?.length) {
      builder.add(buildMemberTitle('Methods'))
      builder.add(methodNodes, undefined, state)
    }

    return builder.content
  },
  [ContentKind.Api.Constructor]: empty, // TODO
  [ContentKind.Api.Property]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', node.data.displayName), u('text', ' property')]
    // if (state.options.headingBaseDepth === 6) {
    if (state.options.headingBaseDepth > 1) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth +
        // 1) as MdastHeading['depth']
        5) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 2) as MdastHeading['depth']
    if (commentNode) {
      builder.add(
        commentNode.children,
        // { options: { headingBaseDepth } },
        {
          handlers: {
            [ContentKind.Doc.BlockTag]: (n, s) =>
              state.handlers[ContentKind.Doc.BlockTag](n, {
                ...s,
                options: {
                  headingBaseDepth,
                  ...s?.options,
                },
              }),
          },
        },
        state,
      )
    }

    return builder.content
  },
  [ContentKind.Api.Method]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', `${node.data.displayName}()`), u('text', ' method')]
    // if (state.options.headingBaseDepth === 6) {
    if (state.options.headingBaseDepth > 1) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth +
        // 1) as MdastHeading['depth']
        5) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    if (commentNode) {
      builder.add({ type: ContentKind.Doc.ParamCollection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })

      const summaryNode = find(commentNode, {
        data: commentNode.data.summarySection,
      })
      if (!summaryNode || !find(summaryNode, { data: commentNode.data.returnsBlock })) {
        const returnsNode = find(commentNode, {
          data: commentNode.data.returnsBlock,
        }) as Proxied<Block> | undefined
        if (returnsNode?.children.length) {
          builder.add(u('paragraph', [u('strong', [u('text', 'Returns:')])]))
          builder.add(returnsNode, { handlers: { [ContentKind.Doc.BlockTag]: null } }, state)
        } else {
          builder.add([
            u('paragraph', [u('strong', [u('text', 'Returns:')])]),
            u('paragraph', [
              u('text', node.data.excerpt.text.slice(node.data.excerpt.text.lastIndexOf(':')).slice(2, -1)),
            ]),
          ])
        }
      }
    }

    const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 2) as MdastHeading['depth']
    if (commentNode) {
      builder.add(
        commentNode.children,
        // { options: { headingBaseDepth } },
        {
          handlers: {
            [ContentKind.Doc.BlockTag]: (n, s) =>
              state.handlers[ContentKind.Doc.BlockTag](n, {
                ...s,
                options: {
                  headingBaseDepth,
                  ...s?.options,
                },
              }),
          },
        },
        state,
      )
    }

    return builder.content
  },
  [ContentKind.Api.Function]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', `${node.data.displayName}()`), u('text', ' function')]
    if (state.options.headingBaseDepth === 6) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth + 1) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    if (commentNode) {
      builder.add({ type: ContentKind.Doc.ParamCollection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })

      const summaryNode = find(commentNode, {
        data: commentNode.data.summarySection,
      })
      if (!summaryNode || !find(summaryNode, { data: commentNode.data.returnsBlock })) {
        const returnsNode = find(commentNode, {
          data: commentNode.data.returnsBlock,
        }) as Proxied<Block> | undefined
        if (returnsNode?.children.length) {
          builder.add(u('paragraph', [u('strong', [u('text', 'Returns:')])]))
          builder.add(returnsNode, { handlers: { [ContentKind.Doc.BlockTag]: null } }, state)
        } else {
          builder.add([
            u('paragraph', [u('strong', [u('text', 'Returns:')])]),
            u('paragraph', [
              u('text', node.data.excerpt.text.slice(node.data.excerpt.text.lastIndexOf(':')).slice(2, -1)),
            ]),
          ])
        }
      }
    }

    if (commentNode) {
      builder.add(commentNode.children, undefined, state)
    }

    return builder.content
  },
  [ContentKind.Api.Namespace]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', node.data.displayName), u('text', ' namespace')]
    if (state.options.headingBaseDepth === 6) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth + 1) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const buildMemberTitle = (name: string) => {
      const title = [u('text', name)]
      // if (state.options.headingBaseDepth === 6) {
      if (state.options.headingBaseDepth > 4) {
        return u('paragraph', [u('strong', title)])
      } else {
        const depth = (state.options.headingBaseDepth +
          // 1) as MdastHeading['depth']
          2) as MdastHeading['depth']
        return u('heading', { depth } as const, title)
      }
    }

    const classNodes = find(node, { type: [ContentKind.Api.Class] })
    if (classNodes?.length) {
      builder.add(buildMemberTitle('Classes'))
      builder.add(classNodes, undefined, state)
    }

    const enumNodes = find(node, { type: [ContentKind.Api.Enum] })
    if (enumNodes?.length) {
      builder.add(buildMemberTitle('Enumerations'))
      builder.add(enumNodes, undefined, state)
    }

    const functionNodes = find(node, { type: [ContentKind.Api.Function] })
    if (functionNodes?.length) {
      builder.add(buildMemberTitle('Functions'))
      builder.add(functionNodes, undefined, state)
    }

    const interfaceNodes = find(node, { type: [ContentKind.Api.Interface] })
    if (interfaceNodes?.length) {
      builder.add(buildMemberTitle('Interfaces'))
      builder.add(interfaceNodes, undefined, state)
    }

    const namespaceNodes = find(node, {
      type: [ContentKind.Api.Namespace as Namespace['type']],
    })
    if (namespaceNodes?.length) {
      // TODO: fix type issue for `ContentKind.Api.Namespace` resulting in `never`
      builder.add(buildMemberTitle('Namespaces'))
      builder.add(namespaceNodes, undefined, state)
    }

    const variableNodes = find(node, { type: [ContentKind.Api.Variable] })
    if (variableNodes?.length) {
      builder.add(buildMemberTitle('Variables'))
      builder.add(variableNodes, undefined, state)
    }

    const typeAliasNodes = find(node, { type: [ContentKind.Api.TypeAlias] })
    if (typeAliasNodes?.length) {
      builder.add(buildMemberTitle('Type Aliases'))
      builder.add(typeAliasNodes, undefined, state)
    }

    return builder.content
  },
  [ContentKind.Api.Enum]: empty,
  [ContentKind.Api.EnumMember]: empty,
  [ContentKind.Api.Variable]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', node.data.displayName), u('text', ' variable')]
    // if (state.options.headingBaseDepth === 6) {
    if (state.options.headingBaseDepth > 1) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth +
        // 1) as MdastHeading['depth']
        5) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 2) as MdastHeading['depth']
    if (commentNode) {
      builder.add(
        commentNode.children,
        // { options: { headingBaseDepth } },
        {
          handlers: {
            [ContentKind.Doc.BlockTag]: (n, s) =>
              state.handlers[ContentKind.Doc.BlockTag](n, {
                ...s,
                options: {
                  headingBaseDepth,
                  ...s?.options,
                },
              }),
          },
        },
        state,
      )
    }

    return builder.content
  },
  [ContentKind.Api.Interface]: empty,
  [ContentKind.Api.TypeAlias]: (node, state) => {
    const builder = new Builder()

    const title = [u('inlineCode', node.data.displayName), u('text', ' type')]
    // if (state.options.headingBaseDepth === 6) {
    if (state.options.headingBaseDepth > 1) {
      builder.add(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth +
        // 1) as MdastHeading['depth']
        5) as MdastHeading['depth']
      builder.add(u('heading', { depth } as const, title))
    }

    const commentNode = find(node, { data: node.data.tsdocComment })
    if (commentNode) {
      builder.add({ data: commentNode.data.summarySection }, commentNode, {
        ...state,
        handle: state.handlers[commentNode.type],
      })
    }

    builder.add([
      u('paragraph', [u('strong', [u('text', 'Signature:')])]),
      u('code', { lang: 'ts' }, node.data.excerpt.text),
    ])

    const headingBaseDepth = Math.min(6, state.options.headingBaseDepth + 2) as MdastHeading['depth']
    if (commentNode) {
      builder.add(
        commentNode.children,
        // { options: { headingBaseDepth } },
        {
          handlers: {
            [ContentKind.Doc.BlockTag]: (n, s) =>
              state.handlers[ContentKind.Doc.BlockTag](n, {
                ...s,
                options: {
                  headingBaseDepth,
                  ...s?.options,
                },
              }),
          },
        },
        state,
      )
    }

    return builder.content
  },
  [ContentKind.Api.MethodSignature]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('paragraph', [u('strong', [u('text', 'Signature')])]), u('code', { lang: 'ts' }, node.data.excerpt.text))
    return res
  },
  [ContentKind.Api.PropertySignature]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('paragraph', [u('strong', [u('text', 'Signature')])]), u('code', { lang: 'ts' }, node.data.excerpt.text))
    return res
  },
  // TODO: fix type issue for `ContentKind.Api.CallSignature` resulting in `never`
  [ContentKind.Api.CallSignature]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('paragraph', [u('strong', [u('text', 'Signature')])]), u('code', { lang: 'ts' }, node.data.excerpt.text))
    return res
  },
  [ContentKind.Api.ConstructSignature]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('paragraph', [u('strong', [u('text', 'Signature')])]), u('code', { lang: 'ts' }, node.data.excerpt.text))
    return res
  },
  [ContentKind.Api.IndexSignature]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('paragraph', [u('strong', [u('text', 'Signature')])]), u('code', { lang: 'ts' }, node.data.excerpt.text))
    return res
  },
  [ContentKind.Api.None]: () => [],
  /* -------- */
  [ContentKind.Doc.Comment]: (node, state) => {
    const children = [
      find(node, { data: node.data.summarySection }),
      find(node, { data: node.data.remarksBlock }),
      find(node, { data: node.data.deprecatedBlock }), //? extra summarySection
      // find(node, { data: node.data.privateRemarks }),
      ...(find(node, { data: node.data.customBlocks }) ?? []), // + example
      find(node, { data: node.data.params }),
      // TODO: tell DocParamCollection handler to treat this as Type Parameters
      find(node, { data: node.data.typeParams }),
      find(node, { data: node.data.returnsBlock }), //? extra summarySection
      ...(find(node, { data: node.data.modifierTagSet.nodes }) ?? []),
      ...(find(node, { data: node.data.seeBlocks }) ?? []),
    ].filter(Boolean) as DocContent[]
    // removes duplicated nodes //! maybe there is a bug in `find`
    return [...new Set(children)].flatMap((n) => (state.handlers[n.type] as Handle)(n) as MdastRootContent[])
  },
  [ContentKind.Doc.Block]: (node, state) => {
    const res: MdastRootContent[] = []

    const tagNode = find(node, { data: node.data.blockTag })
    if (tagNode) {
      switch (tagNode.data.tagName) {
        // TODO: treat @returns block differently
        default:
          res.push(...state.handlers[tagNode.type](tagNode))
      }
    }

    const contentNode = find(node, { data: node.data.content })
    if (contentNode) res.push(...state.handlers[contentNode.type](contentNode))

    return res
  },
  [ContentKind.Doc.Section]: (node, state) => {
    return node.children.flatMap((n) => (state.handlers[n.type] as Handle)(n) as MdastRootContent[])
  },
  [ContentKind.Doc.Paragraph]: (node, state) => {
    const res: MdastRootContent[] = []
    const p = u('paragraph', [] as MdastRootContent[])
    p.children.push(...node.children.flatMap((n) => (state.handlers[n.type] as Handle)(n) as MdastRootContent[]))
    if (p.children.length) res.push(p as MdastRootContent)
    return res
  },
  [ContentKind.Doc.BlockTag]: (node, state) => {
    const res: MdastRootContent[] = []

    if (node.data.tagName === '@packageDocumentation') return res

    let titleStr = node.data.tagName.slice(1)
    titleStr = (titleStr.at(0)?.toUpperCase() ?? '') + titleStr.slice(1)
    const title = [u('text', titleStr)]
    // if (state.options.headingBaseDepth === 6) {
    if (state.options.headingBaseDepth > 2) {
      res.push(u('paragraph', [u('strong', title)]))
    } else {
      const depth = (state.options.headingBaseDepth +
        // 1) as MdastHeading['depth']
        4) as MdastHeading['depth']
      res.push(u('heading', { depth } as const, title))
    }

    return res
  },
  [ContentKind.Doc.CodeSpan]: (node, _state) => {
    return [u('inlineCode', node.data.code)]
  },
  [ContentKind.Doc.ErrorText]: (node, _state) => {
    if (node.data.text === '\\') return [u('break')] // TODO insert '\n' when after `|` from table
    return [u('text', node.data.text)]
  },
  [ContentKind.Doc.EscapedText]: (node, _state) => {
    // TODO: fix extra spaces around
    return [u('text', node.data.decodedText)]
  },
  [ContentKind.Doc.Excerpt]: (node, _state) => {
    return [u('text', node.data.content.toString())]
  },
  [ContentKind.Doc.FencedCode]: (node, _state) => {
    const langInfo = node.data.language.split(' ')
    const lang = langInfo.at(0)
    const meta = langInfo.slice(1).join(' ')
    return [u('code', { lang, meta }, node.data.code.trim())]
  },
  [ContentKind.Doc.HtmlAttribute]: (node, _state) => {
    let content = ''
    content += node.data.name
    if (node.data.spacingAfterName) content += node.data.spacingAfterName
    content += '='
    if (node.data.spacingAfterEquals) content += node.data.spacingAfterEquals
    content += node.data.value //? wrapped in double quotes (") already
    if (node.data.spacingAfterValue) content += node.data.spacingAfterValue

    return [u('text', content)]
  },
  [ContentKind.Doc.HtmlStartTag]: (node, state) => {
    // if (node.data.name === 'br') return [u('break')]

    const res: MdastRootContent[] = []

    // const content = node.data.emitAsHtml()
    let content = ''
    content += '<'
    content += node.data.name
    if (node.data.spacingAfterName) content += node.data.spacingAfterName
    const attributeNodes = find(node, { data: node.data.htmlAttributes })
    if (attributeNodes?.length) {
      //? has spaces in between already
      content += attributeNodes
        .flatMap((attr) => (state.handlers[attr.type](attr) as MdastText[]).map((n) => n.value))
        .join('')
    }
    content += node.data.selfClosingTag ? '/>' : '>'

    res.push(u('html', content))

    // TODO: compare with md list parsing in typedoc and api-documenter
    if (node.data.name === 'br') res.push(u('break'))
    // if (node.data.name === 'br') res.push(u('text', '\n'))

    return res
  },
  [ContentKind.Doc.HtmlEndTag]: (node, _state) => {
    const res: MdastRootContent[] = []

    const content = node.data.emitAsHtml()
    // let content = ''
    // content += '</'
    // content += node.data.name
    // content += '>'

    res.push(u('html', content))

    return res
  },
  [ContentKind.Doc.InlineTag]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(
      u('paragraph', [
        u('text', '{'),
        u('strong', [u('text', node.data.tagName)]),
        u('text', ` ${node.data.tagContent}`),
        u('text', '}'),
      ]),
    )
    return res
  },
  [ContentKind.Doc.InheritDocTag]: (node, state) => {
    const res: MdastRootContent[] = []
    const declarationReferenceNode = find(node, {
      data: node.data.declarationReference,
    })
    if (declarationReferenceNode) res.push(...state.handlers[declarationReferenceNode.type](declarationReferenceNode))
    return res
  },
  [ContentKind.Doc.LinkTag]: (node, state) => {
    const res: MdastRootContent[] = []
    if (node.data.urlDestination) {
      if (node.data.linkText) {
        res.push(u('link', { url: node.data.urlDestination }, [u('text', node.data.linkText)]))
      } else {
        res.push(u('text', node.data.urlDestination))
      }
    } else {
      const declarationReferenceNode = find(node, {
        data: node.data.codeDestination,
      })
      if (declarationReferenceNode) res.push(...state.handlers[declarationReferenceNode.type](declarationReferenceNode))
    }
    return res
  },
  /**
   * @privateRemarks
   *
   * {@link https://www.thecandidstartup.org/2024/07/08/bootstrapping-tsdoc.html}
   * {@link https://api-extractor.com/pages/tsdoc/declaration_references/}
   */
  [ContentKind.Doc.DeclarationReference]: (node, state) => {
    const res: MdastRootContent[] = []
    if (node.data.packageName) {
      res.push(u('text', node.data.packageName))
      if (node.data.importPath) res.push(u('text', '::'))
    }
    if (node.data.importPath) res.push(u('text', node.data.importPath))
    const memberReferenceNodes = find(node, {
      data: node.data.memberReferences,
    })
    if (memberReferenceNodes?.length) {
      if (res.length) res.push(u('text', '!'))
      res.push(...memberReferenceNodes.flatMap((n) => state.handlers[n.type](n)))
    }

    //! temp
    res.unshift(u('text', '[['))
    res.push(u('text', ']]'))
    return [u('inlineCode', res.map((n) => (n as MdastText).value).join(''))] as MdastRootContent[]

    // return res
  },
  /**
   * @privateRemarks
   *
   * example-library#ui.controls.Button.(render:static) is a declaration reference
   * that contains three member references: ui, .controls, and .Button, and .(render:static)
   */
  [ContentKind.Doc.MemberReference]: (node, state) => {
    const res: MdastRootContent[] = []
    const identifierNode = find(node, { data: node.data.memberIdentifier })
    const symbolNode = find(node, { data: node.data.memberSymbol })
    const selectorNode = find(node, { data: node.data.selector })
    if (identifierNode) {
      res.push(...state.handlers[identifierNode.type](identifierNode))
    } else if (symbolNode) {
      res.push(...state.handlers[symbolNode.type](symbolNode))
    }
    if (selectorNode) {
      res.unshift(u('text', '('))
      res.push(u('text', ':'), ...state.handlers[selectorNode.type](selectorNode), u('text', ')'))
    }
    if (node.data.hasDot) res.unshift(u('text', '.'))

    return res
  },
  [ContentKind.Doc.MemberIdentifier]: (node, _state) => {
    const res: MdastRootContent[] = []
    res.push(u('text', node.data.identifier))
    if (node.data.hasQuotes) {
      res.unshift(u('text', '"'))
      res.push(u('text', '"'))
    }
    return res
  },
  [ContentKind.Doc.MemberSymbol]: (node, state) => {
    const res: MdastRootContent[] = []
    const declarationReferenceNode = find(node, {
      data: node.data.symbolReference,
    })
    if (declarationReferenceNode) res.push(...state.handlers[declarationReferenceNode.type](declarationReferenceNode))
    return res
  },
  [ContentKind.Doc.MemberSelector]: (node, _state) => {
    const res: MdastRootContent[] = []
    // node.data.errorMessage
    res.push(u('text', node.data.selector))
    // node.data.selectorKind === SelectorKind.Error // .Index, .Label, .System
    return res
  },
  [ContentKind.Doc.ParamBlock]: (node, state) => {
    const res: MdastRootContent[] = []
    const sectionNode = find(node, { data: node.data.content })
    if (sectionNode) {
      const p = u('paragraph', [] as MdastRootContent[])
      p.children.push(
        u('text', node.data.parameterName),
        u('text', ' - '),
        ...state.handlers[sectionNode.type](sectionNode),
      )
      res.push(p as MdastRootContent)
    }
    return res
  },
  [ContentKind.Doc.ParamCollection]: (node, state) => {
    const res: MdastRootContent[] = []
    const blockNodes = find(node, { data: node.data.blocks })
    if (blockNodes?.length) {
      const title = [u('text', 'Parameters')]
      // if (state.options.headingBaseDepth === 6) {
      if (state.options.headingBaseDepth > 2) {
        res.push(u('paragraph', [u('strong', title)]))
      } else {
        const depth = (state.options.headingBaseDepth +
          // 1) as MdastHeading['depth']
          4) as MdastHeading['depth']
        res.push(u('heading', { depth } as const, title))
      }

      res.push(...blockNodes.flatMap((b) => state.handlers[b.type](b)))
    }
    return res
  },
  [ContentKind.Doc.PlainText]: (node, _state) => {
    // return [u('text', node.data.text)]
    const res = fromMarkdown(node.data.text).children
    const range = node.data.textExcerpt?.getContainingTextRange()
    const isNewLine = range?.buffer[range.pos - 1] === '\\'
    if (node.data.text.startsWith(' ')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let spaces = /^\s+/.exec(node.data.text)![0]
      if (isNewLine) spaces = spaces.slice(1) // prevents `&#x20;` as first symbol on new line
      res.unshift(u('text', spaces))
    }
    if (node.data.text.endsWith(' '))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.push(u('text', /\s+$/.exec(node.data.text)![0]))
    return res
  },
  [ContentKind.Doc.SoftBreak]: (_node, _state) => {
    // return [u('break')]
    // return [u('text', '\n')]
    return []
  },
}

function toMdast<T extends Nodes>(
  tree: T,
  options?: Partial<Options> | null,
): T['type'] extends typeof ContentKind.Api.Model ? MdastRoot : MdastRootContent[] {
  const internalHandlers: InternalHandlers = {
    ...defaultHandlers,
    ...options?.handlers,
  }
  const state = {} as State<T['type']>
  const handle = internalHandlers[tree.type] as InternalHandle<T['type']>
  const handlers = new Proxy<Handlers>(internalHandlers as Handlers, {
    get(target, prop: keyof InternalHandlers): Handle<typeof prop> {
      const handle = (target as InternalHandlers)[prop] as InternalHandle<typeof prop>
      return (node, partialState) => {
        const { handlers: partialHandlers, options: partialOptions, ...partialStateRest } = partialState ?? {}
        if (partialHandlers) {
          Object.keys(partialHandlers).forEach((k) => {
            if (partialHandlers[k] === null) {
              ;((partialHandlers as Handlers)[k] as Handle) = () => []
            } else if (!partialHandlers[k]) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete partialHandlers[k]
            }
          })
        }
        return handle(node, {
          ...state,
          handle: handlers[node.type] as Handle<typeof prop>,
          ...partialStateRest,
          handlers: {
            // TODO: scopes/clojures for handlers to parent options
            ...state.handlers,
            ...(partialHandlers as Partial<Handlers>),
          },
          options: {
            handlers: partialOptions?.handlers ?? state.options.handlers,
            headingBaseDepth: partialOptions?.headingBaseDepth ?? state.options.headingBaseDepth,
          },
        })
      }
    },
  })
  state.handle = handlers[tree.type] as Handle as typeof state.handle
  state.handlers = handlers
  state.options = {
    handlers: defaultHandlers,
    headingBaseDepth: 0,
    ...options,
  }
  const treeWithParents = parents(tree)
  return (handle as InternalHandle<NodeType>)(treeWithParents, state) as ReturnType<typeof toMdast<T>>
}

export { defaultHandlers, toMdast }
export type { State, PartialState, Handle }
