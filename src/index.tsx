import {Context, h, Schema, Logger} from 'koishi'

export const name = 'vvsays'

export interface Config {
  picNumber: number,
  searchAPI: string
}

export const Config: Schema<Config> = Schema.object({
  picNumber: Schema.number()
    .default(1)
    .min(0).max(10).step(1)
    .description('查询并返回的VV语录表情包数量'),
  searchAPI: Schema.string()
    .default("https://api.zvv.quest/search")
    .description('VVQuest兼容API接口')
})

export function apply(ctx: Context, config: Config) {
  const logger = new Logger('vvsays')
  ctx.command('zvv <message>').alias('维为').action((_, message) => {
    ctx.http.get(config.searchAPI, {
      params: {
        q: message,
        n: config.picNumber
      }
    }).then(res => {
      if (res.code === 200 && Array.isArray(res.data)) {
        res.data.forEach(pic => {
          _.session.send(h('message', <img src={pic}/>))
        })
      } else {
        logger.error(res.msg || '未知接口错误')
        _.session.send("VV有点累了，不是很想评价")
      }
    }).catch(err => {
      logger.error(err)
      _.session.send("VV非常困惑，不知道如何评价")
    })
  })
}
