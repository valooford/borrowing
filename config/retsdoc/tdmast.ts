import type { Literal as UnistLiteral, Node as UnistNode } from 'unist'

import {
  ApiDocumentedItem,
  ApiItem,
  ApiItemKind,
  ApiCallSignature as CallSignatureData,
  ApiClass as ClassData,
  ApiConstructor as ConstructorData,
  ApiConstructSignature as ConstructSignatureData,
  ApiEntryPoint as EntryPointData,
  ApiEnum as EnumData,
  ApiEnumMember as EnumMemberData,
  ApiFunction as FunctionData,
  ApiIndexSignature as IndexSignatureData,
  ApiInterface as InterfaceData,
  ApiMethod as MethodData,
  ApiMethodSignature as MethodSignatureData,
  ApiModel as ModelData,
  ApiNamespace as NamespaceData,
  ApiPackage as PackageData,
  ApiProperty as PropertyData,
  ApiPropertySignature as PropertySignatureData,
  ApiTypeAlias as TypeAliasData,
  ApiVariable as VariableData,
} from '@microsoft/api-extractor-model'
import {
  DocBlock as BlockData,
  DocBlockTag as BlockTagData,
  DocCodeSpan as CodeSpanData,
  DocComment as CommentData,
  DocDeclarationReference as DeclarationReferenceData,
  DocNode,
  DocNodeKind,
  DocErrorText as ErrorTextData,
  DocEscapedText as EscapedTextData,
  DocExcerpt as ExcerptData,
  DocFencedCode as FencedCodeData,
  DocHtmlAttribute as HtmlAttributeData,
  DocHtmlEndTag as HtmlEndTagData,
  DocHtmlStartTag as HtmlStartTagData,
  DocInheritDocTag as InheritDocTagData,
  DocInlineTag as InlineTagData,
  DocLinkTag as LinkTagData,
  DocMemberIdentifier as MemberIdentifierData,
  DocMemberReference as MemberReferenceData,
  DocMemberSelector as MemberSelectorData,
  DocMemberSymbol as MemberSymbolData,
  DocParagraph as ParagraphData,
  DocParamBlock as ParamBlockData,
  DocParamCollection as ParamCollectionData,
  DocPlainText as PlainTextData,
  DocSection as SectionData,
  DocSoftBreak as SoftBreakData,
} from '@microsoft/tsdoc'

const ContentKind = {
  Api: ApiItemKind,
  Doc: DocNodeKind,
}

interface WithFields<
  Data extends ApiItem | DocNode,
  Children extends NodeType | undefined = undefined,
  ChildrenDefault extends NodeType = NodeType,
> {
  type: DataTypeBy<Data>
  data: Data
  children: Children extends NodeType
    ? Parent<Children>[]
    : ChildrenDefault extends any
      ? Parent<ChildrenDefault>[]
      : never
}
type WithDocFields<Data extends DocNode> = WithFields<Data, DocNodeKind>

//! в них нет `type`
export type Model = WithFields<ModelData, typeof ContentKind.Api.Package>
export type Package = WithFields<PackageData, typeof ContentKind.Api.EntryPoint>
export type EntryPoint = WithFields<EntryPointData>
export type Namespace = WithFields<NamespaceData>
export type Class = WithFields<ClassData>
export type Method = WithFields<MethodData>
export type Property = WithFields<PropertyData>
export type Enum = WithFields<EnumData>
export type EnumMember = WithFields<EnumMemberData>
export type Interface = WithFields<InterfaceData>
export type MethodSignature = WithFields<MethodSignatureData>
export type PropertySignature = WithFields<PropertySignatureData>
export type CallSignature = WithFields<CallSignatureData>
export type Constructor = WithFields<ConstructorData>
export type ConstructSignature = WithFields<ConstructSignatureData>
export type Function = WithFields<FunctionData>
export type IndexSignature = WithFields<IndexSignatureData>
export type TypeAlias = WithFields<TypeAliasData>
export type Variable = WithFields<VariableData>
/* -------- */
export type Comment = WithDocFields<CommentData>
export type Block = WithDocFields<BlockData>
export type BlockTag = WithDocFields<BlockTagData>
export type CodeSpan = WithDocFields<CodeSpanData>
export type DeclarationReference = WithDocFields<DeclarationReferenceData>
export type ErrorText = WithDocFields<ErrorTextData>
export type EscapedText = WithDocFields<EscapedTextData>
export type Excerpt = WithDocFields<ExcerptData>
export type FencedCode = WithDocFields<FencedCodeData>
export type HtmlAttribute = WithDocFields<HtmlAttributeData>
export type HtmlEndTag = WithDocFields<HtmlEndTagData>
export type HtmlStartTag = WithDocFields<HtmlStartTagData>
export type InheritDocTag = WithDocFields<InheritDocTagData>
export type InlineTag = WithDocFields<InlineTagData>
export type LinkTag = WithDocFields<LinkTagData>
export type MemberIdentifier = WithDocFields<MemberIdentifierData>
export type MemberReference = WithDocFields<MemberReferenceData>
export type MemberSelector = WithDocFields<MemberSelectorData>
export type MemberSymbol = WithDocFields<MemberSymbolData>
export type Paragraph = WithDocFields<ParagraphData>
export type ParamBlock = WithDocFields<ParamBlockData>
export type ParamCollection = WithDocFields<ParamCollectionData>
export type PlainText = WithDocFields<PlainTextData>
export type Section = WithDocFields<SectionData>
export type SoftBreak = WithDocFields<SoftBreakData>

type DataTypeBy<Data extends ApiItem | DocNode> = NodeType extends infer K
  ? K extends NodeType
    ? RootContentMap[K]['data'] extends Data
      ? K
      : never
    : never
  : never

interface RootContentMap {
  [ContentKind.Api.Model]: Model
  [ContentKind.Api.Package]: Package
  [ContentKind.Api.EntryPoint]: EntryPoint
  [ContentKind.Api.Namespace]: Namespace
  [ContentKind.Api.Class]: Class
  [ContentKind.Api.Method]: Method
  [ContentKind.Api.Property]: Property
  [ContentKind.Api.Enum]: Enum
  [ContentKind.Api.EnumMember]: EnumMember
  [ContentKind.Api.Interface]: Interface
  [ContentKind.Api.MethodSignature]: MethodSignature
  [ContentKind.Api.PropertySignature]: PropertySignature
  [ContentKind.Api.CallSignature]: CallSignature
  [ContentKind.Api.Constructor]: Constructor
  [ContentKind.Api.ConstructSignature]: ConstructSignature
  [ContentKind.Api.Function]: Function
  [ContentKind.Api.IndexSignature]: IndexSignature
  [ContentKind.Api.TypeAlias]: TypeAlias
  [ContentKind.Api.Variable]: Variable
  [ContentKind.Api.None]: WithFields<ApiItem>
  /* -------- */
  [ContentKind.Doc.Comment]: Comment
  [ContentKind.Doc.Block]: Block
  [ContentKind.Doc.BlockTag]: BlockTag
  [ContentKind.Doc.CodeSpan]: CodeSpan
  [ContentKind.Doc.DeclarationReference]: DeclarationReference
  [ContentKind.Doc.ErrorText]: ErrorText
  [ContentKind.Doc.EscapedText]: EscapedText
  [ContentKind.Doc.Excerpt]: Excerpt
  [ContentKind.Doc.FencedCode]: FencedCode
  [ContentKind.Doc.HtmlAttribute]: HtmlAttribute
  [ContentKind.Doc.HtmlEndTag]: HtmlEndTag
  [ContentKind.Doc.HtmlStartTag]: HtmlStartTag
  [ContentKind.Doc.InheritDocTag]: InheritDocTag
  [ContentKind.Doc.InlineTag]: InlineTag
  [ContentKind.Doc.LinkTag]: LinkTag
  [ContentKind.Doc.MemberIdentifier]: MemberIdentifier
  [ContentKind.Doc.MemberReference]: MemberReference
  [ContentKind.Doc.MemberSelector]: MemberSelector
  [ContentKind.Doc.MemberSymbol]: MemberSymbol
  [ContentKind.Doc.Paragraph]: Paragraph
  [ContentKind.Doc.ParamBlock]: ParamBlock
  [ContentKind.Doc.ParamCollection]: ParamCollection
  [ContentKind.Doc.PlainText]: PlainText
  [ContentKind.Doc.Section]: Section
  [ContentKind.Doc.SoftBreak]: SoftBreak
}
type NodeType = keyof RootContentMap

interface Node<T extends NodeType = NodeType> extends UnistNode {
  type: T
  data: RootContentMap[T]['data']
}
interface Parent<T extends NodeType = NodeType> extends Node<T> {
  children: RootContentMap[T]['children']
}
interface Literal extends UnistLiteral {
  //?
  value: never // TODO use it instead of Data (user-defined)
}

// exports

export { ContentKind, ApiItemKind, DocNodeKind, type NodeType }

export type Root = Parent<typeof ContentKind.Api.Model>
export type RootContent<T extends NodeType = NodeType> = Parent<T>
export type RootData = RootContent['data']
export type { RootContentMap }

export type { Node, Parent, Literal }
export type Nodes = RootContentMap[NodeType]
export type Parents = Extract<Nodes, { children: Node[] }>
export type Literals = Extract<Nodes, Literal>

export type ApiContent = Parent<ApiItemKind>
export type DocContent = Parent<DocNodeKind>
export type ApiDocumentedContent = Parent<ApiItemWithDocComment>
type ApiItemWithDocComment<T = ApiItemKind> = T extends ApiItemKind
  ? RootContentMap[T]['data'] extends ApiDocumentedItem
    ? T
    : never
  : never

export type Data = Node['data']
export type ApiData = ApiContent['data']
export type DocData = DocContent['data']
export type ApiDocumentedData = ApiDocumentedContent['data']

export type {
  ModelData,
  PackageData,
  EntryPointData,
  NamespaceData,
  ClassData,
  MethodData,
  PropertyData,
  EnumData,
  EnumMemberData,
  InterfaceData,
  MethodSignatureData,
  PropertySignatureData,
  CallSignatureData,
  ConstructorData,
  ConstructSignatureData,
  FunctionData,
  IndexSignatureData,
  TypeAliasData,
  VariableData,
  /* -------- */
  CommentData,
  BlockData,
  BlockTagData,
  CodeSpanData,
  DeclarationReferenceData,
  ErrorTextData,
  EscapedTextData,
  ExcerptData,
  FencedCodeData,
  HtmlAttributeData,
  HtmlEndTagData,
  HtmlStartTagData,
  InheritDocTagData,
  InlineTagData,
  LinkTagData,
  MemberIdentifierData,
  MemberReferenceData,
  MemberSelectorData,
  MemberSymbolData,
  ParagraphData,
  ParamBlockData,
  ParamCollectionData,
  PlainTextData,
  SectionData,
  SoftBreakData,
}
