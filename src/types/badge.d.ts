export type BadgeInfo = {
  definitionId: string;
  name: string;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description?: string;
  created_at: number;
  image: string;
  width: number;
  height: number;
};
