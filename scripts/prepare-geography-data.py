import json,unicodedata,re,hashlib,sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent; stage=Path(sys.argv[1])
upstream=json.loads((stage/'countries.json').read_text())
provenance=json.loads((stage/'provenance.json').read_text())
base='https://github.com/mledoze/countries/blob/'+provenance['mledoze/countries']['commit']+'/countries.json'
source={
'za':'https://www.gov.za/about-sa/south-africas-provinces',
'lk':'https://www.mfa.gov.lk/national-profile-and-geography',
'lk-colombo':'https://www.emb-havana.gov.lk/en/sri-lanka-profile',
'bo':'https://assets.publishing.service.gov.uk/media/5dfbaa0c40f0b6666e23013a/191216_FCO_439_-_Bolivia_pdf.pdf',
'nl':'https://www.government.nl/binaries/government/documenten/publications/2017/04/21/culture-at-a-first-glance/CIB2015_ENG_publicatie_v8_DEF.pdf',
'my':'https://www.ppj.gov.my/storage/lain-lain/808/808.pdf',
'bj':'https://benin.bj/en/benin',
'sz':'https://www.parliament.gov.sz/about/stateopening/',
'sz-mbabane':'https://40years.gov.sz/mbabane-from-town-to-capital-city/',
'ch':'https://www.aboutswitzerland.eda.admin.ch/en/political-system',
'gq':'https://www.guineaecuatorialpress.com/index.php/noticias/el_presidente_de_la_republica_proclama_la_ciudad_de_la_paz_como_capital_de_la_republica_de_guinea_ecuatorial_con_la_firma_de_un_decreto_ley',
'id':'https://ikn.go.id/id/posts/pembangunan-tahap-ii-ikn-terus-berjalan-otorita-ikn-lakukan-evaluasi-berkala',
'ps':'https://www.un.org/unispal/permanent-status-issues/',
'fm':'https://bankingboard.gov.fm/overview.htm',
'nr':'https://www.dfat.gov.au/geo/heads-of-government/naoero',
'zw':'https://www.rbz.co.zw/documents/mps/2024/CONSOLIDATED_MPS_Review_-_August_2024.pdf',
}
def slug(value):
 value=unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower()
 return re.sub(r'[^a-z0-9]+','-',value).strip('-')
def capital(name,role='Capital',note=None,url=base):
 result={'id':slug(name),'name':name,'role':role,'source':url}
 if note: result['note']=note
 return result
overrides={
'ZA':[capital('Pretoria','Administrative capital',url=source['za']),capital('Cape Town','Legislative capital',url=source['za']),capital('Bloemfontein','Judicial capital','Home to the Supreme Court of Appeal. The Constitutional Court is in Johannesburg.',source['za'])],
'LK':[capital('Sri Jayawardenepura Kotte','Administrative / legislative capital',url=source['lk']),capital('Colombo','Executive / judicial seat','Also commonly described as the commercial capital.',source['lk-colombo'])],
'BO':[capital('Sucre','Constitutional capital',url=source['bo']),capital('La Paz','Administrative seat of government',url=source['bo'])],
'NL':[capital('Amsterdam','Capital',url=source['nl']),capital('The Hague','Seat of government',url=source['nl'])],
'MY':[capital('Kuala Lumpur','National capital',url=source['my']),capital('Putrajaya','Federal administrative centre',url=source['my'])],
'BJ':[capital('Porto-Novo','Official capital',url=source['bj']),capital('Cotonou','Seat of government',url=source['bj'])],
'SZ':[capital('Mbabane','Administrative capital',url=source['sz-mbabane']),capital('Lobamba','Royal / legislative seat',url=source['sz'])],
'CH':[capital('Bern','Federal city / de facto capital','Switzerland does not designate a de jure capital.',source['ch'])],
'NR':[capital('Yaren','De facto government district','Nauru has no officially designated capital; government offices are in Yaren.',source['nr'])],
'GQ':[capital('Ciudad de la Paz','Capital','Designated as capital on 2 January 2026; replaces Malabo.',source['gq'])],
'PS':[capital('East Jerusalem','Claimed capital','The status of Jerusalem is disputed and subject to negotiations.',source['ps']),capital('Ramallah','Administrative seat','Shown as an administrative seat, not as the claimed capital.')],
}
notes={
'IL':'Jerusalem is designated as capital by Israel. Its status and international recognition are disputed.',
'PS':'East Jerusalem is claimed as capital; Ramallah is the administrative seat. The status of Jerusalem is disputed.',
'ID':'Capital relocation to Nusantara is in progress; the authority targets a political capital there in 2028. Jakarta remains the capital entry in this snapshot.',
'VA':'Vatican City is included as the territorial representation of the Holy See, a UN observer state.',
'ZW':'Zimbabwe uses a multicurrency system. These are selected currencies, not an exhaustive list of accepted payment methods.',
}
records=[]
for c in upstream:
 if not(c.get('unMember') or c['cca2'] in ['PS','VA']): continue
 code=c['cca2'];continent=c['region']
 if continent=='Americas': continent='South America' if c['subregion']=='South America' else 'North America'
 currencies=[{'code':k,'name':v['name']} for k,v in c['currencies'].items()]
 if code=='FM': currencies=[{'code':'USD','name':'United States dollar'}]
 if code=='ZW': currencies=[{'code':'ZWG','name':'Zimbabwe Gold (ZiG)'},{'code':'USD','name':'United States dollar'}]
 records.append({'id':code,'slug':slug(c['name']['common']),'name':c['name']['common'],'alternatives':list(dict.fromkeys(c.get('altSpellings',[])+[v['common'] for v in c['name'].get('native',{}).values()])),'continent':continent,'classification':'UN observer representation' if code in ['PS','VA'] else 'UN member','capitals':overrides.get(code,[capital(n) for n in c['capital']]),'languages':list(c['languages'].values()),'currencies':currencies,'location':{'lat':c['latlng'][0],'lng':c['latlng'][1]},'flag':'/flags/'+code.lower()+'.svg','reviewed':'2026-10-14','sources':{'identity':base,'geography':base,'languages':base,'currencies':source['zw'] if code=='ZW' else source['fm'] if code=='FM' else base},**({'note':notes[code]} if code in notes else {})})
records.sort(key=lambda c: c['name'].casefold())
text=json.dumps(records,ensure_ascii=False,indent=2)+'\n'
(root/'src/data/countries/countries.json').write_text(text)
(root/'public/data/countries.json').write_text(text)
manifest={'reviewed':'2026-10-14','upstream':provenance,'sha256':hashlib.sha256(text.encode()).hexdigest(),'license':'ODbL-1.0','countryCount':len(records),'classificationSource':'https://www.un.org/en/about-us/non-member-states','capitalEntryCount':sum(len(c['capitals']) for c in records),'scope':'193 UN member states plus Palestine and Vatican City (Holy See representation); territories and other non-members excluded.','continentModel':'Six groups: Africa, Asia, Europe, North America (including Central America and the Caribbean), South America, and Oceania. Upstream region assignments retained: Russia is Europe; Türkiye, Cyprus, Armenia, Georgia, Azerbaijan and Kazakhstan are Asia. Antarctica has no records.','reviewMethod':'Schema and scope validated for all records. Capital roles and noted transitions reviewed using linked primary sources; remaining facts follow the pinned community dataset, not an independent audit of every field.','sources':source}
(root/'src/data/countries/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(root/'public/data/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
land=json.loads((stage/'land.geojson').read_text()); paths=[]
for feature in land['features']:
 geometry=feature['geometry'];polygons=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
 for polygon in polygons:
  rings=[]
  for ring in polygon:
   coords=[(round(lon+180,2),round(90-lat,2)) for lon,lat,*_ in ring]
   rings.append('M'+'L'.join(f'{x},{y}' for x,y in coords)+'Z')
  paths.append('<path d="'+''.join(rings)+'"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180"><g fill="#d8e6f4" fill-rule="evenodd">'+''.join(paths)+'</g></svg>\n'
(root/'public/maps/world-land.svg').write_text(svg)
print('Prepared',len(records),'countries and',manifest['capitalEntryCount'],'capital / seat entries')
