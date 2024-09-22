/* eslint-disable no-unused-vars */
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { selectAll } from "../heroesFilters/filtersSlice";
import store from '../../store';

import { useCreateHeroMutation } from '../../api/apiSlice';

const HeroesAddForm = () => {
    const [createHero, {isLoading}] = useCreateHeroMutation();

    const { filtersLoadingStatus } = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: ''
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                        .min(4, 'Минимум 4 символа для заполнения')
                        .required('Обязательное поле!'),
                description: Yup.string()
                        .min(4, 'Минимум 4 символа для заполнения')
                        .required('Обязательное поле!'),
                element: Yup.string()
                        .required('Обязательное поле!')
            })}
            onSubmit = {(values, { resetForm }) => {
                const newHero = {id: uuidv4(), ...values};
                createHero(newHero).unwrap();
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"/>
                    <ErrorMessage className='error'name='name' component='div'/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        name="description" 
                        className="form-control" 
                        id="text" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                    <ErrorMessage className='error'name='description' component='div'/>

                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field 
                        className="form-select" 
                        id="element" 
                        name="element"
                        as="select">
                        <option >Я владею элементом...</option>
                        {renderFilters(filters, filtersLoadingStatus)}
                    </Field>
                    <ErrorMessage className='error'name='element' component='div'/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;