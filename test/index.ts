/**
 * Created by xiezj on 2016/12/5.
 */
namespace NSpiderManager {

    enum ManagerEvents{
        CurrentTargetChange
    }

    interface SpiderItem {
        id: any;
        status: any;
        percent: number;
        [name: string]: any;
    }

    interface ISpiderManager {
        setSpider(spider: ISpider);
        /**
         * 准备工作
         */
        prepare();

        /**
         * 获取目标。默认返回全部数据，可分页获取
         * @param limit
         * @param page
         */
        getTargets(page?: number, limit?: number): SpiderItem[];

        /**
         * 获取目标总数
         */
        getTargetsCount(): number;
        /**
         * 获取正在分析的目标
         */
        getCurrentTargets(): SpiderItem[];

        /**
         * 订阅事件
         * @param event
         * @param cb
         */
        on(event: ManagerEvents, cb: (...args)=>any);

        /**
         * 分析指定id
         * @param id
         */
        parse(id: any);

        /**
         * 分析指定id的特定类型数据
         * @param id
         * @param type
         */
        parse(id: any, type: string);
        /**
         * 自动根据列表分析目标
         */
        autoParse();

        /**
         * 停止分析
         */
        stop();

        /**
         * 设置autoParse的并发数
         * @param num
         */
        setThreads(num: number);
    }

    interface ISpider {

    }

    class SpiderManager implements ISpiderManager {
        getTargetsCount(): number {
            return 0;
        }

        getCurrentTargets(): SpiderItem[] {
            return [];
        }

        stop() {
        }

        setSpider(spider: ISpider) {
        }

        setThreads(num: number) {
        }

        parse(id: any, type: string = 'all') {
        }

        autoParse() {
        }

        getTargets(page?: number, limit?: number): SpiderItem[] {
            return [
                {
                    id: 333,
                    status: 'parsing',
                    percent: 50,
                    item: {
                        url: "http://github.com"
                    },
                }
            ];
        }

        on(event: ManagerEvents, cb: (args)=>any) {
        }

        prepare() {
        }
    }

    class Spider implements ISpider {

    }


    let manager: ISpiderManager = new SpiderManager();

    manager.prepare();
    manager.getTargetsCount();
    manager.on(ManagerEvents.CurrentTargetChange, (...args) => {
        console.log(args);
    });

    manager.getTargets();
}
