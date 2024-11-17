export type ListItem = {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: { pc: string | null; mobile: string | null; web: string | null };
  action?: "block" | "message";
  blockId?: string;
  messageText?: string;
  extra?: Object;
};

export type Button = {
  label: string;
  action?: "webLink" | "message" | "block" | "phone";
  webLinkUrl?: string;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?: Object;
};

export type CustomBoardItemData = {
  title: string;
  description?: string;
  imageUrl?: string;
  params?: Object;
};

export type QuickReplie = {
  label: string;
  action: "block" | "Message";
  messageText?: string;
  blockId?: string;
  extra?: Object;
};

export const BlockName = {
  STUDENT_INFO_CHECK: "673a060cbdae5e01db2d635d",
  STUDENT_COURSE_LIST_CHECK: "673a0670ce60fd538c828e4d",
  STUDENT_COURSE_LIST_MODIFY: "673a06582d667f58ef377093",
  TEACHER_INFO_CHECK: "673a0612ce60fd538c828e44",
  NOTIFICATION_LIST_CHECK: "673856eb3c62a258f61daf01", //
  NOTIFICATION_DETAIL_CHECK: "6738c7fd3e5a5d75822bf735", //
  ASSIGNMENT_LIST_CHECK: "67397b5b02837f15f683771b", //
  ASSIGNMENT_DETAIL_CHECK: "673993a335af7f582befdd5a", //
};
export type BlockId = (typeof BlockName)[keyof typeof BlockName];

class KakaoBotResponse {
  data: any;

  constructor() {
    this.data = {
      version: "2.0",
      template: { outputs: [], quickReplies: [] },
      context: null,
      data: null,
    };
  }

  addSimpleTextOutput(text: string) {
    this.data.template.outputs.push({
      simpleText: {
        text: text,
      },
    });
  }

  addSimpleImageOutput(imageUrl: string, altText: string) {
    this.data.template.outputs.push({ simpleImage: { imageUrl, altText } });
  }

  addListCardOutput(header: string, itemArray: ListItem[], buttonArray: Button[] | null) {
    this.data.template.outputs.push({
      listCard: { header: { title: header }, items: itemArray, buttons: buttonArray },
    });
  }

  addTextCardOutput(title: string, description: string, buttonArray: Button[] | null) {
    this.data.template.outputs.push({
      textCard: { title, description, buttons: buttonArray },
    });
  }

  addCustomBoard(
    header: string,
    itemDataArray: CustomBoardItemData[],
    listBlockId: string,
    detailBlockId: string,
    page: number,
    isEndPage: boolean,
    extraButtonArray?: Button[]
  ) {
    const itemArray: ListItem[] = itemDataArray.map((itemData) => {
      const { title, description, imageUrl, params } = itemData;

      return {
        title,
        description: description,
        imageUrl,
        action: "block",
        blockId: detailBlockId,
        extra: params,
      };
    });

    const buttonArray: Button[] = [];
    if (page !== 1) {
      // 1페이지면 이전 버튼 X
      buttonArray.push({
        label: "이전",
        action: "block",
        blockId: listBlockId,
        extra: { page: page - 1 },
      });
    }
    if (!isEndPage) {
      // 1페이지면 이전 버튼 X
      buttonArray.push({
        label: "다음",
        action: "block",
        blockId: listBlockId,
        extra: { page: page + 1 },
      });
    }

    if (extraButtonArray?.length) {
      extraButtonArray.forEach((extraButton) => [buttonArray.push(extraButton)]);
    }

    this.data.template.outputs.push({
      listCard: { header: { title: header }, items: itemArray, buttons: buttonArray },
    });
  }

  addQuickReplie(quickReplie: QuickReplie) {
    this.data.template.quickReplies.push(quickReplie);
  }

  getData() {
    return this.data;
  }
}

export default KakaoBotResponse;
