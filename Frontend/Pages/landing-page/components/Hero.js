import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import BelowHeroIllustration from '../../../illustrations/BelowHeroIllustration.js';



export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            Find Your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Dream Job
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Join a supportive community dedicated to navigating the complexities of the job market and achieving collective success. Here, you'll find mentorship, networking opportunities, and a wealth of resources to propel your career forward with confidence and clarity.

            {/* <div style={{ margin: '0px 290px 0px 0px', width: '54px', height: '52.6562px', float: 'none', clear: 'none', zIndex: '4', position: 'relative', transformOrigin: '50% 50%', transform: 'translate3d(-9.9803px, 0px, 0px)', display: 'inline-block', visibility: 'inherit' }}>
  <sr7-loop>
    <sr7-img id="hero-1740-8" className="sr7-layer" data-order="0" style={{ overflow: 'visible', padding: '0px', verticalAlign: 'inherit', transformOrigin: '50% 50%', transform: 'translate(0px, 0px)', width: '54px', height: '52.6562px', display: 'block', visibility: 'inherit', backgroundImage: 'url("https://www.sliderrevolution.com/wp-content/uploads/revslider/startup-hero/heart-3d-icon.png")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: '50% 50%', backgroundClip: 'content-box', opacity: '1', pointerEvents: 'auto' }}></sr7-img>
  </sr7-loop>
</div> */}

          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
           
            <Button variant="contained" color="primary">
              <Link style={{textDecoration:"none", color:"white"}} href="/job-listings" color="primary">
              Let's Find a Jobs
              </Link>
            </Button>
          </Stack>
          <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
            By clicking &quot;Let's Find&quot; you agree to our&nbsp;
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            width: '100%',
            backgroundImage:
              theme.palette.mode === 'light'
                ? 'url("/static/images/templates/templates-images/hero-light.png")'
                : 'url("/static/images/templates/templates-images/hero-dark.png")',
            backgroundSize: 'cover',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor:
              theme.palette.mode === 'light'
                ? alpha('#BFCCD9', 0.2)
                : alpha('#9CCCFC', 0.1),
            // boxShadow:
            //   theme.palette.mode === 'light'
            //     ? `0 0 12px 8px ${alpha('#9CCCFC', 0.1)}`
            //     : `0 0 24px 12px ${alpha('#033363', 0.1)}`,
          })}
        />
        {/* <BelowHeroIllustration style={{ width: '100px', height: '100px',  }} /> */}

      </Container>
    </Box>
  );
}