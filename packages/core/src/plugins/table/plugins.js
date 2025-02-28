import {DecorationSet, Decoration} from "prosemirror-view";
import {Plugin, PluginKey} from "prosemirror-state";
import {findParentNode} from "prosemirror-utils";
import {columnResizing, tableEditing} from "prosemirror-tables";

export const tablePluginKey = new PluginKey("table");

export default [
  new Plugin({
    key: tablePluginKey,

    state: {
      init: () => {
        return {};
      },
      apply(tr, _2, _3, newState) {
        let editorHasFocus = tr.getMeta("EDITOR_FOCUSED");
        if (editorHasFocus === false) return {};
        let decoration;
        const {schema, selection} = newState;
        const {table_cell, table_header} = schema.nodes;
        const tableCell = findParentNode(
          ({type}) => type === table_cell || type === table_header
        )(selection);
        if (tableCell) {
          decoration = DecorationSet.create(newState.doc, [
            Decoration.node(
              tableCell.start - 1,
              tableCell.start + tableCell.node.nodeSize - 1,
              {
                class: "nib-table-cell-marker",
                style: "position: relative;"
              }
            )
          ]);
        }
        return {decoration};
      }
    },

    props: {
      decorations(state) {
        const tablePluginState = state && tablePluginKey.getState(state);
        return tablePluginState.decoration;
      }
    }
  }),
  columnResizing(),
  tableEditing()
];
