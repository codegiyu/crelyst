import { LucideProps } from 'lucide-react';
import mongoose from 'mongoose';
import { ForwardRefExoticComponent, RefAttributes, RefObject, SVGProps, type JSX } from 'react';

export type PropsWithVideoDisplayRef<T = unknown> = T & {
  videoDisplayRef: RefObject<HTMLElement | null>;
};

export interface TitleAndText {
  title: string;
  text: string;
}

export type SelectorFn<TStore, TResult> = (state: TStore) => TResult;

export type IconComp = (props: SVGProps<SVGSVGElement>) => JSX.Element;
export type LucideIconComp = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

export interface TitleAndIcon {
  title: string;
  Icon: IconComp;
}

export interface SelectOption<T = string> {
  text: string;
  altText?: string;
  value: T;
  disabled?: boolean;
  Icon?: IconComp;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type OneCharString<T extends string> = T extends `${infer First}${infer Rest}`
  ? Rest extends ''
    ? T
    : never
  : never;

export type NumberInString = `${number}`;

export type FormErrors<T extends object> = Partial<Record<keyof T | 'root', string[] | undefined>>;

export type ValidObjectTypeKey<T extends object, K> = {
  [X in keyof T]: T[X] extends K ? X : never;
}[keyof T];

interface BaseImageOrVideoUrl {
  image?: string;
  video?: string;
}
interface JustImageURL extends BaseImageOrVideoUrl {
  image: string;
  video?: never;
}
interface JustVideoURL extends BaseImageOrVideoUrl {
  video: string;
  image?: never;
}

export type ImageOrVideoURL = JustImageURL | JustVideoURL;

export type MongooseToFrontend<T> = T extends mongoose.Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? MongooseToFrontend<U>[]
      : T extends object
        ? { [K in keyof T]: MongooseToFrontend<T[K]> }
        : T;

export interface SidebarLinkPath {
  prefix: string;
  suffix: string;
}

interface BaseSidebarLink {
  Icon?: IconComp;
  LucideIcon?: LucideIconComp;
  page: string;
  path?: SidebarLinkPath;
  action?: () => void;
}

interface SidebarLinkWithIcon extends BaseSidebarLink {
  Icon: IconComp;
  LucideIcon?: never;
}

interface SidebarLinkWithLucideIcon extends BaseSidebarLink {
  Icon?: never;
  LucideIcon: LucideIconComp;
}

export type ISidebarLink = SidebarLinkWithIcon | SidebarLinkWithLucideIcon;

export interface ISidebarLinkGroup {
  groupName: string;
  links: ISidebarLink[];
}
