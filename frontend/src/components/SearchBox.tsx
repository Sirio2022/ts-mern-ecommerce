
import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {


    const navigate = useNavigate()

    const [query, setQuery] = useState('')

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault()
        navigate(query ? `/search/?query=${query}` : '/search')
        setQuery('')
    }

    return (
        <Form className='flex-grow-1 d-flex me-auto' onSubmit={submitHandler}>
            <InputGroup>
                <Form.Control
                    type='text'
                    name='q'
                    placeholder='Search products...'
                    className='rounded-0'
                    aria-label='Search products...'
                    aria-describedby='button-search'
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    type='submit'
                    variant='outline-primary'
                    className='rounded-0'
                >
                    <i className='fa fa-search'></i>
                </Button>
            </InputGroup>
        </Form>
    )
}
