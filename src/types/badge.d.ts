export type BadgeInfo = {
  definitionId: string;
  name: string;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description?: string;
  image: string;
  width: number;
  height: number;
};
