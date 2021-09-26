export interface TagItem {
  tagId: string;
  tagName: string;
  groupId?: string;
  groupName?: string;
  modified?: number;
  displayType?: number;
}

export interface TagInterface {
  tagId: string;
  tagName: string;
  groupId: string;
  tagList?: TagItem[];
}
export interface TagGroup {
  groupId: string;
  groupName: string;
  tagList: TagInterface[];
}

export interface TagCategory {
  category: number;
  groupList: TagGroup[];
}
