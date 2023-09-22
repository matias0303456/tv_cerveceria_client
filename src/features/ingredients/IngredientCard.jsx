import { AiFillDelete, AiFillEdit } from 'react-icons/ai'

import { deleteConfirmation } from '../../utils/toaster'

export function IngredientCard({ ingredient, current, setCurrent, edit, setEdit }) {
    return (
        <div className="ingredientCard" style={{
            backgroundColor: (current.id !== ingredient.id || !edit) ? 'gold' : '#AD692A',
            color: (current.id !== ingredient.id || !edit) ? 'black' : '#FCE78A',
            boxShadow: '1px 1px 3px black',
            width: '20%',
            height: 150,
            overflow: 'scroll',
            padding: 10,
            textAlign: 'center',
            borderRadius: 5,
            wordWrap: 'break-word',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div>
                <h3>{ingredient.name}</h3>
                <p style={{ fontSize: 10 }}>{ingredient.type.name}</p>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20
            }}>
                {(current.id !== ingredient.id || !edit) ?
                    <>
                        <span className='actions' onClick={() => {
                            setCurrent({
                                id: ingredient.id,
                                name: ingredient.name,
                                type_id: ingredient.type.id
                            })
                            setEdit(true)
                        }}>
                            <AiFillEdit />
                        </span>
                        <span className='actions' onClick={() => deleteConfirmation()}>
                            <AiFillDelete />
                        </span>
                    </> :
                    <p>Editando</p>
                }
            </div>
        </div>
    )
}