import type { AsyncCreatableProps } from "react-select/async-creatable";
import type { GroupBase } from "react-select";

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> extends AsyncCreatableProps<Option, IsMulti, Group> {

}
