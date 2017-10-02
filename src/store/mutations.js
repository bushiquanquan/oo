/**
 * @file mutations  必须是同步函数
 * @author yuanhuihui  2017/9/30
 */
import { INIT_STATE} from './mutation-types';

export default {
    [INIT_STATE]: (state, { userInfo }) => { // 使用时this.$store.commit('INIT_STATE', info);
        state.userInfo = userInfo;
    }
};

