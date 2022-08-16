import {useDispatch, useSelector} from 'react-redux';
import {heroCreated, heroesFetchingError} from '../../actions';
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
    const [heroName, setHeroName] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filtersLoadingStatus, filters} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement
        }

        const config = {
            method: "POST",
            data: {
                ...formData
            }
        }

        request(`http://localhost:3001/heroes`, config)
            .then(() => dispatch(heroCreated(formData)))
            .catch(() => dispatch(heroesFetchingError()))

        setHeroName('')
        setHeroDescription('')
        setHeroElement('')
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (<form onSubmit={e => handleSubmit(e)} className="border p-4 shadow-lg rounded">
        <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
            <input
                onChange={e => setHeroName(e.target.value)}
                value={heroName}
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
                onChange={e => setHeroDescription(e.target.value)}
                value={heroDescription}
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
                onChange={e => setHeroElement(e.target.value)}
                value={heroElement}
                required
                className="form-select"
                id="element"
                name="element">
                <option>Я владею элементом...</option>
                {renderFilters(filters, filtersLoadingStatus)}
            </select>
        </div>

        <button type="submit" className="btn btn-primary">Создать
        </button>
    </form>)
}

export default HeroesAddForm;