import { ChangeEvent, FC, useContext, useMemo, useState } from "react";
import { GetServerSideProps } from 'next'
import { useRouter } from "next/router";

import { capitalize, Card, CardActions, CardContent, CardHeader, Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton } from "@mui/material";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Layout } from "@/components/layouts";
import { Entry, EntryStatus } from '@/interfaces';
import { dbEntries } from "@/database";
import { IEntry } from "@/models";
import { EntriesContext } from "@/context/entries";
import { dateFunctions } from '../../utils';

const validStatus:EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props {
  entry: IEntry
}

const EntryPage:FC<Props> = ({ entry }) => {

  const { updateEntry, removeEntry } = useContext(EntriesContext);
  const router = useRouter();

  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);

  const isNotValid = useMemo(
    () => inputValue.length <= 0 && touched,
  [inputValue, touched])

  const onInputValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  }

  const onSave = () => {
    if(inputValue.trim().length === 0) return;

    const updatedEntry:Entry = {
      ...entry,
      status,
      description: inputValue
    };

    updateEntry(updatedEntry, true);
  }

  const onDelete = () => {
    removeEntry(entry._id);
    router.push('/');
  }

  return (
    <Layout title={ inputValue.substring(0, 20) + "..."}>
      <Grid
        container
        justifyContent='center'
        sx={{ marginTop: 2 }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={'Entrada:'}
              subheader={`Creada hace: ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`}
            />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                fullWidth
                placeholder="Nueva Entrada"
                autoFocus
                multiline
                label="Nueva Entrada"
                value={inputValue}
                onBlur={() => setTouched(true)}
                onChange={onInputValueChanged}
                helperText={ isNotValid && 'Ingrese un valor' }
                error={ isNotValid }
              />
              <FormControl>
                <FormLabel>Estado:</FormLabel>
                <RadioGroup
                  row
                  value={status}
                  onChange={onStatusChanged}
                >
                  {
                    validStatus.map(option => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={capitalize(option)}
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SaveOutlinedIcon />}
                variant="contained"
                fullWidth
                onClick={onSave}
                disabled={ inputValue.length <= 0 }
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position:'fixed',
          bottom: 30,
          right: 30,
          backgroundColor: 'red'
        }}
        onClick={onDelete}
      >
        <DeleteOutlinedIcon />
      </IconButton>


    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({params}) => {
  
  const { id } = params as { id: string };

  const entry = await dbEntries.getEntryById(id);
  
  if (!entry) {
    return {
      redirect: {
        path: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      entry: {...entry, _id: entry._id.toString()}
    }
  }
}

export default EntryPage;