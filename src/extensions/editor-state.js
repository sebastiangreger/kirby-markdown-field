import { EditorState } from "@codemirror/state";
import { drawSelection, placeholder, keymap } from "@codemirror/view";
import { history, historyKeymap } from "@codemirror/history";
import { standardKeymap } from "@codemirror/commands";
import {
  markdown,
  markdownKeymap,
  markdownLanguage,
} from "@codemirror/lang-markdown";
import markdownCommands from "./commands";
import { theme, highlightStyle } from "./theme";
import customHighlights from "./custom-highlights";
import specialChars from "./special-chars";
import lineStyles from "./line-styles";
import kirbytags from "./kirbytags";

const defaultConfig = {
  customHighlights: [],
  highlights: true,
  invisibles: false,
  placeholder: "",
  kirbytags: [],
};

export default function editorState(value, config, oldState = null) {
  config = {
    ...defaultConfig,
    ...config,
  };

  const extensions = [
    history(),
    keymap.of([
      ...standardKeymap,
      ...historyKeymap,
      ...markdownKeymap,
      ...markdownCommands,
    ]),
    highlightStyle,
    kirbytags(config.kirbytags),
    markdown({
      base: markdownLanguage,
    }),
    ...customHighlights(config.customHighlights, config.highlights, config),
  ];

  if (config.specialChars) {
    extensions.push(specialChars());
  }

  extensions.push(
    lineStyles,
    drawSelection(),
    placeholder(config.placeholder ?? ""),
    theme,
  );

  return EditorState.create({
    doc: value ?? "",
    selection: oldState ? oldState.selection : null,
    extensions,
    tabSize: 4,
  });
}
