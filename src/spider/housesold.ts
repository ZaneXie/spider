/**
 * Created by qing.he on 2016/12/6.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");
import {inject, injectable} from 'inversify';
import {BaseSpider} from "./base";
import {SERVICE_IDENTIFIER} from "../constants/ioc";
import {IHouseManager} from "../manager/house";
import {IComplexManager} from "../manager/complex";


@injectable()
export class CDHouseSoldSpider extends BaseSpider {

    public constructor(@inject(SERVICE_IDENTIFIER.HouseManager) houseManager: IHouseManager,
                       @inject(SERVICE_IDENTIFIER.ComplexManager) complexManager: IComplexManager) {
        super();
        this.houseManager = houseManager;
        this.complexManager = complexManager;
        this.curDate = new Date();
    }

    private houseManager: IHouseManager;
    private complexManager: IComplexManager;
    private curDate: Date;
    private targetUrls: string[] = [];

    async parsePromise(url: string) {
        debug("parsing url: " + url);
        let complexID = "";
        let pattern_complex= /(\d{8,})/
        let match_complex = pattern_complex.exec(url);
        if (match_complex && match_complex[0]) {
            complexID = match_complex[0];
        }
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let houses:{}[] = [];
        $(".main-box .clinch-list li").each(function (key, ele) {
            let title = $(ele).find("h2 a").text();
            let infos = $(ele).find(".div-cun");
            let time = $(infos.get(0)).text();
            let price = $(infos.get(1)).text();
            let total = $(infos.get(2)).text();
            let detail = $(ele).find(".other .con").text();
            let url = $(ele).find(".info-panel h2 a").attr("href");
            let pattern = /.*\/(.*)\.html/
            let match = pattern.exec(url);
            let id = "";
            if (match && match[1]) {
                id = match[1];
            }
            let buildInfo = title.split(" ");
            let layout = "";
            let area = 0;
            if (buildInfo.length === 3){
                layout = buildInfo[2];
                let pattern_area = /(\d+\.?\d+)/
                let match_area = pattern_area.exec(buildInfo[3]);
                if (match_area && match_area[0]) {
                    area = parseInt(match_area[0]);
                }
            }
            let house = {
                lj_id: id,
                url: url,
                title: title,
                complex_id: complexID,
                layout: layout,
                area: area,
                location: "Nav",
                total_price: total,
                unit_price: price,
                visitor_num: 0,
                detail: detail,
            };
            debug(house);
            houses.push(house);
        });
        return houses;
    }

    public getNextUrl(): string {
        let url = "";
        if (this.targetUrls.length > 0){
            url = this.targetUrls[this.targetUrls.length - 1];
            this.targetUrls.pop();
        }
        return url;
    }

    public async hasTask(): Promise<boolean> {
        await this.updateUrlsFromDB();
        return this.targetUrls.length > 0;
    }

    public saveToDB(houses: {}[]) {
        // return this.houseManager.save(houses);
        debug("save: " + houses);
    }

    private async updateUrlsFromDB(){
        let complexes = await this.complexManager.getComplexesToBeUpdated(this.curDate, 1);
        let jobs: Promise<any>[] = [];
        for (let complex of complexes) {
            jobs.push(this.parsePage(complex.lj_id));
        }
        await Promise.all(jobs);
    }

    async parsePage(complexID: string) {
        let url = "http://cd.lianjia.com/chengjiao/c" + complexID + "/";
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let totalPage = $(".page-box").attr("page-data").trim();
        let totalPageNum = parseInt(JSON.parse(totalPage)['totalPage']);
        for (let pageNum = 1; pageNum <= totalPageNum; pageNum++) {
            this.targetUrls.push(url + "pg" + pageNum);
        }
    }
}
