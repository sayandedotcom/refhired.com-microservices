"use client";

import clsx from "clsx";
import { ChevronDownIcon, Loader2, X } from "lucide-react";
import Select, {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  InputActionMeta,
  MultiValueRemoveProps,
  components,
} from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <X />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <X />
    </components.MultiValueRemove>
  );
};

const controlStyles = {
  base: "border border-border rounded-lg bg-background hover:cursor-pointer hover:bg-secondary",
  hasValue: "bg-muted",
  focus: "border-border ring-ring ring-primary-500",
  nonFocus: "border-border",
};
const placeholderStyles = "text-muted-foreground text-sm ml-1";
const selectInputStyles = "text-foreground text-sm ml-1";
const valueContainerStyles = "text-foreground text-sm";
const singleValueStyles = "ml-1";
const multiValueStyles =
  "ml-1 bg-foreground text-background rounded-md border border-border rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5 rounded-lg";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md bg-background";
const indicatorsContainerStyles = "p-1 gap-1 bg-background rounded-lg";
const clearIndicatorStyles = "text-gray-500 p-1 rounded-md hover:text-foreground hover:bg-destructive";
const indicatorSeparatorStyles = "bg-mutated";
const dropdownIndicatorStyles = "p-1 hover:text-foreground text-gray-500";
const menuStyles = "mt-2 p-2 border border-border bg-muted text-sm rounded-lg";
const optionsStyle =
  "p-2 border-0 text-base hover:bg-foreground hover:text-background rounded-sm h-10 hover:cursor-pointer";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm bg-background";
const noOptionsMessageStyles = "text-muted-foreground bg-background";

type SelectComponentProps = {
  options: any[];
  value?: any;
  onChange?: (newValue, actionMeta) => void;
  isMulti?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  createAble: boolean;
  placeholder?: string;
  onInputChange?: (newValue: any, actionMeta: InputActionMeta) => void;
  getOptionValue?: any;
  defaultValue?: any;
};

export const SelectComponent = ({
  options,
  value,
  onChange,
  isMulti,
  isDisabled,
  isLoading,
  createAble,
  placeholder,
  onInputChange,
  getOptionValue,
  defaultValue,
  ...props
}: SelectComponentProps) => {
  const animatedComponents = makeAnimated();
  const Comp = createAble ? CreatableSelect : Select;
  return (
    <>
      <Comp
        closeMenuOnSelect={!isMulti}
        getOptionValue={getOptionValue}
        onInputChange={onInputChange}
        loadingMessage={() => <Loader2 className="mx-auto my-2 h-4 w-4 animate-spin" />}
        unstyled
        isClearable
        isSearchable
        value={value}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isLoading={isLoading}
        placeholder={placeholder}
        components={animatedComponents}
        defaultInputValue={defaultValue}
        defaultValue={value}
        options={options}
        noOptionsMessage={() => "No options found !!"}
        onChange={onChange}
        classNames={{
          control: ({ isFocused, hasValue }) =>
            // clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
            clsx(hasValue ? controlStyles.hasValue : null, controlStyles.base),
          placeholder: () => placeholderStyles,
          input: () => selectInputStyles,
          option: () => optionsStyle,
          menu: () => menuStyles,
          valueContainer: () => valueContainerStyles,
          singleValue: () => singleValueStyles,
          multiValue: () => multiValueStyles,
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          indicatorsContainer: () => indicatorsContainerStyles,
          clearIndicator: () => clearIndicatorStyles,
          indicatorSeparator: () => indicatorSeparatorStyles,
          dropdownIndicator: () => dropdownIndicatorStyles,
          groupHeading: () => groupHeadingStyles,
          noOptionsMessage: () => noOptionsMessageStyles,
        }}
        {...props}
      />
    </>
  );
};
