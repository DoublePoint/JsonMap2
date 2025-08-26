import { ElNotification } from 'element-plus';

export const $warning = (message: string, title?: string) => {
  ElNotification({
    title: title || '警告',
    dangerouslyUseHTMLString: true,
    message,
    duration: 10000,
    type: 'warning',
  });
};
