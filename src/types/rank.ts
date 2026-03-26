export interface Benefit {
  icon: string;
  label: string;
}

export interface RankTier {
  code: string;
  name: string;
  color: string;
  benefits: Benefit[];
}
