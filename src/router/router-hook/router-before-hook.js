export default function beforeEachCallback (store) {
    return (to, from, next) => {
        next();
    };
}
