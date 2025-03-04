## API Report File for "@fluentui/react-infobutton"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="react" />

import type { ComponentProps } from '@fluentui/react-utilities';
import type { ComponentState } from '@fluentui/react-utilities';
import { ForwardRefComponent } from '@fluentui/react-utilities';
import { Label } from '@fluentui/react-label';
import type { PopoverProps } from '@fluentui/react-popover';
import type { PopoverSurface } from '@fluentui/react-popover';
import * as React_2 from 'react';
import type { Slot } from '@fluentui/react-utilities';
import type { SlotClassNames } from '@fluentui/react-utilities';

// @public
export const InfoButton: ForwardRefComponent<InfoButtonProps>;

// @public (undocumented)
export const infoButtonClassNames: SlotClassNames<InfoButtonSlots>;

// @public
export type InfoButtonProps = Omit<ComponentProps<Partial<InfoButtonSlots>>, 'disabled'> & {
    size?: 'small' | 'medium' | 'large';
};

// @public (undocumented)
export type InfoButtonSlots = {
    root: NonNullable<Slot<'button'>>;
    popover: NonNullable<Slot<Partial<PopoverProps>>>;
    info: NonNullable<Slot<typeof PopoverSurface>>;
};

// @public
export type InfoButtonState = ComponentState<InfoButtonSlots> & Required<Pick<InfoButtonProps, 'size'>>;

// @public
export const InfoIcon: ForwardRefComponent<InfoIconProps>;

// @public (undocumented)
export const infoIconClassNames: SlotClassNames<InfoIconSlots>;

// @public
export const InfoIconLabel: ForwardRefComponent<InfoIconLabelProps>;

// @public (undocumented)
export const infoIconLabelClassNames: SlotClassNames<InfoIconLabelSlots>;

// @public
export type InfoIconLabelProps = ComponentProps<InfoIconLabelSlots> & {};

// @public (undocumented)
export type InfoIconLabelSlots = {
    root: Slot<'div'>;
};

// @public
export type InfoIconLabelState = ComponentState<InfoIconLabelSlots>;

// @public
export type InfoIconProps = ComponentProps<InfoIconSlots> & {};

// @public (undocumented)
export type InfoIconSlots = {
    root: Slot<'div'>;
};

// @public
export type InfoIconState = ComponentState<InfoIconSlots>;

// @public
export const InfoLabel: ForwardRefComponent<InfoLabelProps>;

// @public (undocumented)
export const infoLabelClassNames: SlotClassNames<InfoLabelSlots>;

// @public
export type InfoLabelProps = ComponentProps<Partial<InfoLabelSlots>, 'label'> & {
    info?: InfoButtonProps['info'];
};

// @public (undocumented)
export type InfoLabelSlots = {
    root: NonNullable<Slot<'span'>>;
    label: NonNullable<Slot<typeof Label>>;
    infoButton: Slot<typeof InfoButton>;
};

// @public
export type InfoLabelState = ComponentState<InfoLabelSlots> & Pick<InfoLabelProps, 'size'>;

// @public
export const renderInfoButton_unstable: (state: InfoButtonState) => JSX.Element;

// @public
export const renderInfoIcon_unstable: (state: InfoIconState) => JSX.Element;

// @public
export const renderInfoIconLabel_unstable: (state: InfoIconLabelState) => JSX.Element;

// @public
export const renderInfoLabel_unstable: (state: InfoLabelState) => JSX.Element;

// @public
export const useInfoButton_unstable: (props: InfoButtonProps, ref: React_2.Ref<HTMLElement>) => InfoButtonState;

// @public
export const useInfoButtonStyles_unstable: (state: InfoButtonState) => InfoButtonState;

// @public
export const useInfoIcon_unstable: (props: InfoIconProps, ref: React_2.Ref<HTMLElement>) => InfoIconState;

// @public
export const useInfoIconLabel_unstable: (props: InfoIconLabelProps, ref: React_2.Ref<HTMLElement>) => InfoIconLabelState;

// @public
export const useInfoIconLabelStyles_unstable: (state: InfoIconLabelState) => InfoIconLabelState;

// @public
export const useInfoIconStyles_unstable: (state: InfoIconState) => InfoIconState;

// @public
export const useInfoLabel_unstable: (props: InfoLabelProps, ref: React_2.Ref<HTMLLabelElement>) => InfoLabelState;

// @public
export const useInfoLabelStyles_unstable: (state: InfoLabelState) => InfoLabelState;

// (No @packageDocumentation comment for this package)

```
