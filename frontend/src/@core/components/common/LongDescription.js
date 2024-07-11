import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const MAX_DESCRIPTION_LENGTH = 105

const LongDescription = ({ description, fontSize, setShowFullDescription, showFullDescription }) => {


    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription)
    }

    /* The `useEffect` hook in the provided code snippet is used to set the initial state of
  `showFullDescription` based on the length of the `description` prop. */
    useEffect(() => {
        const isLongDescription = description && description.length > MAX_DESCRIPTION_LENGTH
        if (isLongDescription) setShowFullDescription(true)
    }, [description])

    // If the description is long, truncate it
    const truncatedDescription = showFullDescription && description?.length > MAX_DESCRIPTION_LENGTH
        ? `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`
        : description

    return (
        <Box flex={1}>
            <Typography
                component={'span'}
                fontSize={fontSize ? fontSize : { xs: 14, md: 16 }}
                sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: truncatedDescription }}
            />

            {description && description.length > MAX_DESCRIPTION_LENGTH && (
                <Box component={'span'}>
                    {showFullDescription && (
                        <Button
                            disableRipple
                            disableFocusRipple
                            onClick={toggleDescription}
                            disableTouchRipple
                            disableElevation
                            sx={{ p: 0, ':hover': { backgroundColor: 'transparent !important' } }}
                        >
                            Read more
                        </Button>
                    )}
                    {!showFullDescription && (
                        <Button onClick={toggleDescription} sx={{ p: 0, ':hover': { backgroundColor: 'transparent !important' } }}>
                            Show less
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default LongDescription
