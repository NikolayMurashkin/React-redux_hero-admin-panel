import {useDispatch, useSelector} from 'react-redux';
import {addHero, filtersFetched, heroesFetchingError} from '../../actions';
import {useHttp} from '../../hooks/http.hook';
import {v4 as uuidv4} from 'uuid';
import {useState, useEffect} from "react";

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

    const {heroes, filters} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        request("http://localhost:3001/filters", {method: "GET"})
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
        // eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        setHeroData(heroData => {
            return {
                ...heroData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            "id": uuidv4(),
            "name": heroData.name,
            "description": heroData.description,
            "element": heroData.element
        }

        const config = {
            method: "POST",
            data: {
                ...formData
            }
        }

        request(`http://localhost:3001/heroes`, config)
            .then(() => dispatch(addHero([...heroes, formData])))
            .catch(() => dispatch(heroesFetchingError()))

        e.target.reset();
    }

    const filterSelect = filters.map((filter, i) => {
        switch (filter) {
            case 'fire':
                return <option key={i} value="fire">Огонь</option>
            case 'water':
                return <option key={i} value="water">Вода</option>
            case 'wind':
                return <option key={i} value="wind">Ветер</option>
            case 'earth':
                return <option key={i} value="earth">Земля</option>
            default:
                return filter
        }
    })

    return (<form onSubmit={e => handleSubmit(e)} className="border p-4 shadow-lg rounded">
        <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
            <input
                onChange={e => handleChange(e)}
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
                onChange={e => handleChange(e)}
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
                onChange={e => handleChange(e)}
                required
                className="form-select"
                id="element"
                name="element">
                <option>Я владею элементом...</option>
                {filterSelect}
            </select>
        </div>

        <button type="submit" className="btn btn-primary">Создать
        </button>
    </form>)
}

export default HeroesAddForm;