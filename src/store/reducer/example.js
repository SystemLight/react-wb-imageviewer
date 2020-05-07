export default function example(state = {
    homeText: "这是主页内容",
    aboutText: "这是关于页内容"
}, action) {
    switch (action.type) {
        case "TEST_HOME":
            return {
                homeText: "主页内容变了",
                aboutText: "这是关于页内容"
            };
        case "TEST_ABOUT":
            return {
                homeText: "这是主页内容",
                aboutText: "关于页内容变了"
            };
        default:
            return {
                homeText: "这是主页内容",
                aboutText: "这是关于页内容"
            };
    }
}