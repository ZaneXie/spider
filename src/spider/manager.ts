/**
 * Created by sigma on 2016/12/16.
 */
import {IBaseSpider, SpiderItem, SpiderItemStatus} from './base'

namespace NSpiderManager {

    enum ManagerEvents{
        CurrentTargetChange
    }

    interface ISpiderManager {
        setSpider(spider: IBaseSpider);
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


    class SpiderManager implements ISpiderManager {
        private spider: IBaseSpider;
        private threadNum: number;

        getTargetsCount(): number {
            return this.spider.getAllTargetItemsCount();
        }

        getCurrentTargets(): SpiderItem[] {
            return this.spider.getCurrTargetItems();
        }

        stop() {
        }

        setSpider(spider: IBaseSpider) {
            this.spider = spider;
        }

       setThreads(num: number) {
            this.threadNum = num;
        }

        parse(id: any, type: string = 'all') {

        }

        async autoParse() {
            let jobs:Promise<any>[] = [];
            for (let cnt = 0; cnt < this.threadNum; cnt++) {
                jobs.push(this.spider.run());
            }
            await Promise.all(jobs);
        }

        getTargets(page?: number, limit?: number): SpiderItem[] {
            return [];
        }

        on(event: ManagerEvents, cb: (args)=>any) {
        }

        prepare() {
            this.spider.prepare();
        }
    }

    let manager: ISpiderManager = new SpiderManager();

    manager.prepare();
    manager.getTargetsCount();
    manager.on(ManagerEvents.CurrentTargetChange, (...args) => {
        console.log(args);
    });

    manager.getTargets();
}
