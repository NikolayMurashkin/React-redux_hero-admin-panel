import {useDispatch, useSelector} from 'react-redux';
import {filtersFetched, heroesFetched, heroesFetching, heroesFetchingError} from '../../actions';
import {useHttp} from '../../hooks/http.hook';
import {useEffect, useState} from "react";
import classNames from "classnames";
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {filters} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [activeButton, setActiveButton] = useState('all');

    useEffect(() => {
        request("http://localhost:3001/filters", {method: "GET"})
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
        // eslint-disable-next-line
    }, []);

    const handleClick = (e) => {
        setActiveButton(e.target.value);

        request("http://localhost:3001/heroes", {method: "GET"})
            .then(data => {
                dispatch(heroesFetched(data));
                if (e.target.value === 'all') {
                    return
                }
                const filteredHeroes = data.filter(hero => hero.element === e.target.value);
                dispatch(heroesFetched(filteredHeroes));
            })
            .catch(() => dispatch(heroesFetchingError()))
    }

    let filterButtons = filters.map((filter, i) => {
        switch (filter) {
            case 'fire':
                return <button
                    onClick={handleClick}
                    key={i}
                    value={filter}
                    className={classNames(`btn btn-danger ${activeButton === filter ? 'active' : ''}`)}>Огонь</button>
            case 'water':
                return <button
                    onClick={handleClick}
                    key={i}
                    value={filter}
                    className={classNames(`btn btn-primary ${activeButton === filter ? 'active' : ''}`)}>Вода</button>
            case 'wind':
                return <button
                    onClick={handleClick}
                    key={i}
                    value={filter}
                    className={classNames(`btn btn-success ${activeButton === filter ? 'active' : ''}`)}>Ветер</button>
            case 'earth':
                return <button
                    onClick={handleClick}
                    key={i}
                    value={filter}
                    className={classNames(`btn btn-secondary ${activeButton === filter ? 'active' : ''}`)}>Земля</button>
            default:
                return <button
                    onClick={handleClick}
                    key={i}
                    value={'all'}
                    className={classNames(`btn btn-outline-dark ${activeButton === filter ? 'active' : ''}`)}>Все</button>
        }
    })

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filterButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;