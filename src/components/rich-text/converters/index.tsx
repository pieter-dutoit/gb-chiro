import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import {
  headingConverter,
  linkConverter,
  listConverter,
  listItemConverter,
  paragraphConverter,
  uploadConverter,
} from "./custom-converters";

type NodeTypes = DefaultNodeTypes;

export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
});

export const styledJsxConverter: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...headingConverter,
  ...paragraphConverter,
  ...linkConverter,
  ...listConverter,
  ...listItemConverter,
  ...uploadConverter,
});
