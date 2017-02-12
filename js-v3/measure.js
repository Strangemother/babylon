/*
    Return converion of units.

    Measure.add({
        name: 'distance'
    })
 */
class Measure {

}


Measure.add({
    name: 'distance'
    , values: [
        // shorts, names, mesurement
        ['m'                    , ['meter', 'metre']  , '100cm']
        , [ 'cm'                , 'centimetre'        , '10mm']
        , [ 'mm'                , 'milimetre'         , 1]
        , [ ['µm', 'micron']    , 'micrometre'        , '1^-3m']
        , [ 'nm'                , 'nanometre'         , '1^-6m']
        , [ 'pm'                , 'picometre'         , '1^-9m']
        , [ 'fm'                , 'femometre'         , '1^-12m']
        , [ 'am'                , 'attometre'         , '1^-15m']
        , [ 'zm'                , 'zeptometre'        , '1^-18m']
        , [ 'ym'                , 'yoctometre'        , '1^-21m' ]
    ]
});



Measure.add({
    name: 'distance'
    , values: [
        ['p'                   , 'point',              , '352.777778 µm' ]
        , [['P̸)', 'P']         , 'pica'                , '12p']
        , ['th'                , 'thou'                , '25.4µm']
        , ['in'                , ['inch' , m.postfix('es')], '25.4mm']
        , ['ft'                , ['foot' , 'feet']     , '12 inches']
        , ['yd'                , 'yard'                , '3 ft']
        , ['ch'                , 'chain'               , '22 yd']
        , ['fur'               , 'furlong'             , '22 chains']
        , ['mi'                , 'mile'                , '80 chains']
        , ['lea'               , 'league'              , '3mi']
    ]
});


Measure.add({
    name: 'maritime'
    , values: [
        ['ftm', 'fathom', '6.08ft']
        , [null, 'cable', '100 fathoms']
        , [ ['nmi', 'nm'], 'nautical mile', '10 cables']
    ]
})


Measure.add({
    name: ['mass', 'avoirdupois']
    , values: [
        ['gr'                    , 'grain'               , '1/7000lb']
        , ['dr'                  , 'dram'                , '1.7718451953125 grams']
        , ['oz'                  , 'ounce'               , '16 dr']
        , ['lb'                  , 'pound'               , '16 oz']
        , ['cwt'                 , 'hundredweight'       , '100 lb']
        , ['cwt'                 , 'long-hundredweight'  , '112 lb']
        , ['t'                   , 'ton'                 , '2000 lb']
        , ['lt'                  , 'long-ton'            , '2240 lb']
    ]
})


Measure.add({
    name: 'time'
    , values: [
        ['s'             , 'second'  , 1]
        , ['m'             , 'minute'  , '60 seconds']
        , ['h'             , 'hour'    , '60 minutes']
        , ['d'             , 'day'     , '24 hours']
        , ['y'             , 'year'    , '12 months']
        , ['w'             , 'week'    , '7 days']
        , ['m'             , 'month'   , '28~31 days']
        , ['zeptosecond'               , '10^−21 s']
        , ['attosecond'                , '10^−18 s']
        , ['femtosecond'               , '10^−15 s']
        , ['picosecond'                , '10^−12 s']
        , ['nanosecond'                , '10^−9 s']
        , ['shake'                     , '10^−8 s']
        , ['microsecond'               , '10^−6 s']
        , ['millisecond'               , '0.001s']
        , ['centisecond'               , '0.01s']
        , ['jiffy'                     , '1/60s']
        , ['decisecond'                , '0.1s']
        , ['moment'                    , '1/40th of an hour']
        , ['moment'                    , '90 seconds']
        , ['fortnight'                 , '14 days 2 weeks']
        , ['decasecond'                , '10 seconds']
        , ['hectosecond'               , '100 seconds']
        , ['ke'                        , '864 seconds']
        , ['kilosecond'                , '1,000 seconds']
        , ['megasecond'                , '1,000,000 seconds']
        , ['lunar'                     , '27.2~29.5 days']
        , ['February'                  , '28~29 days']
        , ['quarter'                   , '3 months']
        , ['season'                    , '3 months']
        , ['common-year'               , '365 days']
        , ['tropical-year'             , '365.24219 days']
        , ['Gregorian-year'            , '365.2425 days']
        , ['Julian-year'               , '365.25 days']
        , ['sidereal-year'             , '365.256363004 days']
        , ['leap-year'                 , '366 days']
        , ['biennium'                  , '2 years']
        , ['triennium'                 , '3 years']
        , ['Olympiad'                  , '4 year cycle']
        , ['lustrum'                   , '5 years']
        , ['decade'                    , '10 years']
        , ['Indiction'                 , '15 years']
        , ['generation'                , '17~36 years']
        , ['gigasecond'                , '1,000,000,000 seconds']
        , ['jubilee'                   , '50 years']
        , ['Lifespan'                  , '85~82 years']
        , ['century'                   , '100 years']
        , [["kiloannum", 'millennium'] , '1,000 years']
        , ['terasecond'                , '10^12 seconds']
        , ['megaannum'                 , '1,000,000 years']
        , ['petasecond'                , '10^15 seconds']
        , ['galactic-year'             , '230 million years']
        , ['eon'                       , '500 million years']
        , ['gigaannum'                 , '1,000,000,000 years']
        , ['exasecond'                 , '10^18 seconds']
        , ['teraannum'                 , '1,000,000,000,000 years']
        , ['zettasecond'               , '10^21 seconds']
        , ['petaannum'                 , '1,000,000,000,000,000 years']
        , ['yottasecond'               , '1024 seconds']
    ]
})
