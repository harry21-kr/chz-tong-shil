export interface LiveStream {
  liveId: number;
  liveTitle: string;
  liveThumbnailImageUrl: string;
  concurrentUserCount: number;
  openDate: string;
  adult: boolean;
  tags: string[];
  categoryType: string;
  liveCategory: string;
  liveCategoryValue: string;
  channelId: string;
  channelName: string;
  channelImageUrl: string;
}
