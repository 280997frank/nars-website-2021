export interface OptionData<T = string> {
  value: T;
  label: string;
}

export type SignupSource = "wechat" | "regular";
export type Gender = "male" | "female";
export type Experience = "using" | "tried-it" | "never";
