export const MACERATE_ALARM = {
    type: 'macerate',
    names: [
        'PRIMER_RECIRCULADO_INICIO',
        'PRIMER_RECIRCULADO_FINAL',
        'SEGUNDO_RECIRCULADO_INICIO',
        'SEGUNDO_RECIRCULADO_FINAL',
        'MACERADO_TOTAL',
        'EXTRA'
    ],
    sorting: {
        'PRIMER_RECIRCULADO_INICIO': 1,
        'PRIMER_RECIRCULADO_FINAL': 2,
        'SEGUNDO_RECIRCULADO_INICIO': 3,
        'SEGUNDO_RECIRCULADO_FINAL': 4,
        'MACERADO_TOTAL': 5,
        'EXTRA': 6,
    }
}

export const BOIL_ALARM = {
    type: 'boil',
    names: [
        'PRIMER_LUPULO',
        'SEGUNDO_LUPULO',
        'WHIRPOOL',
        'COCCION_TOTAL'
    ],
    sorting: {
        'PRIMER_LUPULO': 1,
        'SEGUNDO_LUPULO': 2,
        'WHIRPOOL': 3,
        'COCCION_TOTAL': 4,
    }
}

export const MALT_TYPE = 'MALTA'

export const RECIRCULADO = 'RECIRCULADO'
export const TRASVASE = 'TRASVASE'

