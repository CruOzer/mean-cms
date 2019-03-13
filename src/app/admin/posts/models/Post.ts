export interface Post {
  id: string;
  title: string;
  content: string;
  creator?: string;
  date?: Date;
  allowComments: boolean;
  status: string;
  tags: string;
  categories: string;
  titleImagePath?: string;
}
