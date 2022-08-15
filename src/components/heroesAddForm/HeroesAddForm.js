import {useDispatch, useSelector} from 'react-redux';
import {addHero, heroesFetchingError} from '../../actions';
import {useHttp} from '../../hooks/http.hook';
import {v4 as uuidv4} from 'uuid';
import {useState} from "react";


// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const [heroData, setHeroData] = useState({});

    const {heroes} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();


    const onChange = (e) => {
        setHeroData(heroData => {
            return {
                ...heroData,
                [e.target.name]: e.target.value
            }
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = {
            "id": uuidv4(),
            "name": heroData.name,
            "description": heroData.description,
            "element": heroData.element
        }
        const newData = [...heroes, formData];
        const config = {
            method: "POST",
            data: {
                ...formData
            }
        }
        request(`http://localhost:3001/heroes`, config)
            .then((response) => {
                console.log(response)
                dispatch(addHero(newData))
            })
            .catch(() => dispatch(heroesFetchingError()))
    }


    return (<form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
            <input
                onChange={e => onChange(e)}
                value={heroData.name}
                required
                type="text"
                name="name"
                className="form-control"
                id="name"
                placeholder="Как меня зовут?"/>
        </div>

        <div className="mb-3">
            <label htmlFor="description" className="form-label fs-4">Описание</label>
            <textarea
                onChange={e => onChange(e)}
                value={heroData.description}
                required
                name="description"
                className="form-control"
                id="text"
                placeholder="Что я умею?"
                style={{"height": '130px'}}/>
        </div>

        <div className="mb-3">
            <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
            <select
                onChange={e => onChange(e)}
                value={heroData.element}
                required
                className="form-select"
                id="element"
                name="element">
                <option>Я владею элементом...</option>
                <option value="fire">Огонь</option>
                <option value="water">Вода</option>
                <option value="wind">Ветер</option>
                <option value="earth">Земля</option>
            </select>
        </div>

        <button type="submit" onClick={e => onSubmit(e)} className="btn btn-primary">Создать
        </button>
    </form>)
}

export default HeroesAddForm;