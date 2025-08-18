import service from '@/api/http';

const joltApi = {
  // 转换json
   transformJson : (params: object) => service.post(`/jolt/transform`, params),
};

export default joltApi;
