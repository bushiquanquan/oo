/**
 * @file getters mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
 * @author yuanhuihui  2017/9/30
 */

// 获取用户信息
export const account = state => {
    if (state.userInfo.id) {
        return state.userInfo;
    }
    return {};
};

