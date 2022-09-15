const $ = Dom7
const xr = axios

const tagTemplate = `<custom-item style="color:{1}" tag={2}>{0}</custom-item>`
var cache = {}

setInterval(function () {
    $("div.user-name[data-user-id]:not(.ok),div.sub-user-name[data-user-id]:not(.ok),a.name[data-usercard-mid]:not(.ok)").each(function () {
        if (isOnHtmlScreen(this) == true) {
            var mid = $(this).attr("data-user-id") ?? $(this).attr("data-usercard-mid")
            if (mid != void (0)) {
                xSpace(mid, it => setTag(this, it))
                xFollow(mid, it => setTag(this, it))
                $(this).addClass("ok")
            }
        }
    })
}, 2000)

//获取用户动态
async function xSpace(mid, call) {
    var jsonString = cache[mid + "xs"]
    if (jsonString == void (0)) {
        var rsp = await xr.get(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=${mid}`)
        if (rsp.status == 200) {
            // var m = rsp.data.data.items.map(t => t.modules).map(t => t.module_dynamic)
            // var c = rsp.data.data.items.map(t => {
            //     return { c: t.modules, a: t.orig.modules }
            // })
            // var s = c.map(t => { c:t.c, s: t.module_dynamic })
            // console.log(c)
            jsonString = JSON.stringify(rsp.data.data)
            cache[mid + "xs"] = jsonString
        }
    }
    call(jsonString)
}

//获取用户关注
async function xFollow(mid, call) {
    var jsonString = cache[mid + "xf"]
    if (jsonString == void (0)) {
        var rsp = await xr.get(`https://api.bilibili.com/x/relation/followings?vmid=${mid}`)
        if (rsp.status == 200) {
            if (rsp.data.code != 0) {
                rsp.data.data = {}
                rsp.data.data["ext"] = "隐藏关注"
            }
            jsonString = JSON.stringify(rsp.data.data)
            cache[mid + "xf"] = jsonString
        }
    }
    call(jsonString)
}

function getTag(name, color) {
    return tagTemplate.replace("{0}", name).replace("{1}", color).replace("{2}", name)
}

//设置标签
function setTag(selector, jsonString) {
    if ($(selector).find("custom").length <= 0)
        $(selector).prepend(`<custom2>[ <custom></custom> ]</custom2> `)

    if (d == void (0)) return
    for (var it of d) {
        if (it.keywords == void (0)) continue
        for (var keyword of it.keywords) {
            if (jsonString.includes(keyword)) {
                //找是否已存在相同标签,不存在添加
                if ($(selector).find(`custom custom-item[tag='${it.name}']`).length <= 0) {
                    var gun = ""
                    if ($(selector).find(`custom custom-item`).length > 0)
                        gun = "丨"
                    var tag = getTag(it.name, it.color)
                    $(selector).find("custom").append(gun + tag)
                    $(selector).find("custom2").addClass("show")//todo:用样式处理没任何标签显示[]的问题
                }
                break
            }
        }
    }
}