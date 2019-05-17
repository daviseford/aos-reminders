#!/bin/bash
SITE_S3='s3://daviseford.com/aos-reminders/'    # Your S3 bucket address
SITE_BUILD_DIR='./build/'   # Where your site is generated
CF_DIST_ID='EOV559H6J3O6V'  # Cloudfront Distribution ID
CF_PATH='/build/*'          # Cloudfront Path to invalidate
yarn build
aws s3 sync --delete --size-only ${SITE_BUILD_DIR} ${SITE_S3} --exclude "*build_log.txt" --exclude "*.idea*" --exclude "*.sh" --exclude "*.git*" --exclude "*.DS_Store"
aws cloudfront create-invalidation --distribution-id ${CF_DIST_ID} --paths ${CF_PATH}